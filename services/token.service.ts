import { ethers, ContractInterface } from "ethers";
import BigNumber from "bignumber.js";
import LAYER1_ENCRYPT_CONTRACT_ETHEREUM from "./deposit.json";

const gweiToWeiInHex = (gwei: string) =>
  "0x" + new BigNumber(gwei).times(new BigNumber(10).pow(9)).toString(16);

const RINKEBY_DEPOSIT_ADRESS = "0x190387ae3ac96dc4fbad820ec5819a8a5289e8d5";
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

export const transfer = async (
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
