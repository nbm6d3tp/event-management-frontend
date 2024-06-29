export type TCityGroup = {
  letter: string;
  cities: string[];
};
export type TCreateTypeLocation = 'ONSITE' | 'HYBRID' | 'ONLINE';

export type TLocationType = 'Onsite' | 'Hybrid' | 'Online';
export const locationTypes: TLocationType[] = ['Onsite', 'Hybrid', 'Online'];

export const _filterGroup = (
  cityGroups: TCityGroup[],
  value: string
): TCityGroup[] => {
  if (value) {
    return cityGroups
      .map((group) => ({
        letter: group.letter,
        cities: _filter(group.cities, value),
      }))
      .filter((group) => group.cities.length > 0);
  }
  return cityGroups;
};

const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};
