import BigNumber from "bignumber.js";

export const transfer = async (
  transferFrom: string,
  transferTo: string,
  transferAmount: string,
  chainId: number
): Promise<string> => {
  const zecrey = (window as any).zecrey;
  return await zecrey.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: transferFrom,
        to: transferTo,
        value:
          "0x" +
          new BigNumber(transferAmount)
            .times(new BigNumber(10).pow(9))
            .toString(16),
        gasPrice: "0x2540be400",
        gas: "0x5208",
        chainId,
      },
    ],
  });
};
