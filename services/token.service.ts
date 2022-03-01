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
        value: transferAmount,
        gasPrice: "0x2540be400",
        gas: "0x5208",
        chainId,
      },
    ],
  });
};
