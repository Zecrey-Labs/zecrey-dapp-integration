import { ethers, ContractInterface } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import BigNumber from "bignumber.js";
import LAYER1_ENCRYPT_CONTRACT_ETHEREUM from "./deposit.json";
import ERC20_CONTRACT_ETHEREUM from "./ERC20.json";

const gweiToWeiInHex = (gwei: string) =>
  "0x" + new BigNumber(gwei).times(new BigNumber(10).pow(9)).toString(16);

const RINKEBY_DEPOSIT_ADRESS = "0x190387ae3ac96dc4fbad820ec5819a8a5289e8d5";
const RINKEBY_ZRY_CONTRACT_ADDRESS =
  "0x427f3c5a45a5eff380f1834c1a7ee4b080b680cd";
const RINKEBY_CHAIN_ID = "0x4";

export const INFURA_PROJECT_ID = "9aa3d95b3bc440fa88ea12eaa4456161";
const getRpcUrl = (network: string): string =>
  `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
export const RINKEBY_RPC_URL = getRpcUrl("rinkeby");

export const removeZecreyAddressSuffix = (zecreyAddress: string) =>
  zecreyAddress.replace(/\.zecrey/i, "");

const getEncryptDataAndGasLimitOnEthereumLike = async (
  amount: BigNumber,
  zecreyAccountName: string
): Promise<{ transactionData: string; gasLimit: BigNumber }> => {
  const provider = ethers.getDefaultProvider(RINKEBY_RPC_URL, {
    infura: INFURA_PROJECT_ID,
  });
  const contract = new ethers.Contract(
    RINKEBY_DEPOSIT_ADRESS,
    LAYER1_ENCRYPT_CONTRACT_ETHEREUM as ContractInterface,
    provider
  );
  const args = [
    0,
    ethers.utils.formatBytes32String(
      removeZecreyAddressSuffix(zecreyAccountName)
    ),
    {
      value: amount.toString(),
    },
  ];
  const res = await Promise.all([
    contract.populateTransaction.depositOrLockNativeAsset(...args),
    contract.estimateGas.depositOrLockNativeAsset(...args),
  ]);
  const transactionData = res[0].data;
  if (!transactionData) {
    throw new Error("Failed to create transaction.");
  }
  return {
    transactionData,
    gasLimit: new BigNumber(Math.ceil(res[1].toNumber() * 1.5)),
  };
};

const getTransferDataAndGasLimitOnEthereumLike = async (
  amount: string,
  transferFrom: string,
  transferTo: string
): Promise<{
  transactionData: string | undefined;
  gasLimit: ethers.BigNumber;
}> => {
  const provider = ethers.getDefaultProvider("rinkeby", {
    infura: INFURA_PROJECT_ID,
  });
  const contract = new ethers.Contract(
    RINKEBY_ZRY_CONTRACT_ADDRESS,
    ERC20_CONTRACT_ETHEREUM.abi as ContractInterface,
    provider
  );
  const { data } = await contract.populateTransaction.transfer(
    transferTo,
    parseUnits(amount, 18)
  );
  const gasLimit = await provider.estimateGas({
    data,
    from: transferFrom,
    to: transferTo,
  });
  return {
    transactionData: data,
    gasLimit,
  };
};

export const deposit = async (
  address: string,
  gweiAmount: string,
  zecreyAccountName: string = "jason.zecrey"
): Promise<string> => {
  const zecrey = (window as any).zecrey;
  const { transactionData, gasLimit } =
    await getEncryptDataAndGasLimitOnEthereumLike(
      new BigNumber(gweiAmount).times(new BigNumber(10).pow(9)),
      zecreyAccountName
    );
  return await zecrey.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: address,
        to: RINKEBY_DEPOSIT_ADRESS,
        value: gweiToWeiInHex(gweiAmount),
        data: transactionData,
        gasPrice: "0x2540be400",
        gas: "0x" + new BigNumber(gasLimit).toString(16),
        chainId: RINKEBY_CHAIN_ID,
      },
    ],
  });
};

export const transferETH = async (
  transferFrom: string,
  transferTo: string,
  gweiAmount: string
): Promise<string> => {
  const zecrey = (window as any).zecrey;
  return await zecrey.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: transferFrom,
        to: transferTo,
        value: gweiToWeiInHex(gweiAmount),
        gasPrice: "0x2540be400",
        gas: "0x5208",
        chainId: RINKEBY_CHAIN_ID,
      },
    ],
  });
};

export const transferERC20Token = async (
  transferFrom: string,
  transferTo: string,
  amount: string
): Promise<string> => {
  const zecrey = (window as any).zecrey;
  const { transactionData, gasLimit } =
    await getTransferDataAndGasLimitOnEthereumLike(
      amount,
      transferFrom,
      transferTo
    );
  return await zecrey.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: transferFrom,
        to: RINKEBY_ZRY_CONTRACT_ADDRESS,
        value: "",
        data: transactionData,
        gasPrice: "0x2540be400",
        gas: "0x" + gasLimit.toHexString(),
        chainId: RINKEBY_CHAIN_ID,
      },
    ],
  });
};
