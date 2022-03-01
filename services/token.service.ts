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
        gasPrice: "0x09184e72a000",
        gas: "0x2710",
        chainId,
      },
    ],
  });
};
