export type TCityGroup = {
  letter: string;
  names: string[];
};
export type TLocationType = 'ONSITE' | 'HYBRID' | 'ONLINE';
export const locationTypes: TLocationType[] = ['HYBRID', 'ONSITE', 'ONLINE'];

export const _filterGroup = (
  cityGroups: TCityGroup[],
  value: string,
): TCityGroup[] => {
  if (value) {
    return cityGroups
      .map((group) => ({
        letter: group.letter,
        names: _filter(group.names, value),
      }))
      .filter((group) => group.names.length > 0);
  }
  return cityGroups;
};

const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};
