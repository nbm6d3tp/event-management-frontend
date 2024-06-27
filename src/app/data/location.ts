export type TCityGroup = {
  letter: string;
  cities: TCity[];
};

export type TCity = {
  idCity: string;
  name: string;
};
export type TLocationType = 'ONSITE' | 'HYBRID' | 'ONLINE';
export const locationTypes: TLocationType[] = ['HYBRID', 'ONSITE', 'ONLINE'];

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

const _filter = (opt: TCity[], value: string): TCity[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.name.toLowerCase().includes(filterValue));
};
