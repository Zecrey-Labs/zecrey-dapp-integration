export const signMessage = async (
  address: string,
  message: string
): Promise<string> => {
  if (!address) {
    throw new Error("no address");
  }
  const zecrey = (window as any).zecrey;
  return await zecrey?.request({
    method: "personal_sign",
    params: [address, message], // you must have access to the specified account
  });
};
