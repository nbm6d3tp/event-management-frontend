export const hasData = (value?: string | string[] | null) =>
  value && value != '' && value.length > 0;
