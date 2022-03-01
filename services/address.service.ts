export const truncateAddress = (address: string) => {
  const hex = address.slice(0, 2);
  const start = address.slice(2, 6);
  const end = address.slice(-4);
  return `${hex} ${start} ... ${end}`;
};
