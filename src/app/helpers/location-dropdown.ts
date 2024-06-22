export const _filter = (
  opt: {
    item: string;
    selected: boolean;
  }[],
  value: string
): {
  item: string;
  selected: boolean;
}[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.item.toLowerCase().includes(filterValue));
};
