export const removedPages: Array<{
  description: InterProPartialDescription;
  message: string;
}> = [
  {
    description: {
      main: { key: 'set' },
      set: { detail: 'alignments' },
    },
    message: 'Sets/Clans alignment pages were removed on InterPro 80.0',
  },
];

const isObject = (item: unknown): boolean =>
  typeof item === 'object' && item !== null && !Array.isArray(item);

export const doesObjectFits = (
  object: Record<string, unknown>,
  template: Record<string, unknown>
): boolean => {
  for (let [key, value] of Object.entries(template)) {
    if (key in object) {
      if (Array.isArray(value) && Array.isArray(object[key])) {
        if (!doesArrayFits(object[key] as Array<unknown>, value)) return false;
      } else if (isObject(value) && isObject(object[key])) {
        if (
          !doesObjectFits(
            object[key] as Record<string, unknown>,
            value as Record<string, unknown>
          )
        )
          return false;
      } else {
        if (value !== object[key]) return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
export const doesArrayFits = (
  array: Array<unknown>,
  template: Array<unknown>
): boolean => {
  for (let i = 0; i < template.length; i++) {
    if (Array.isArray(template[i]) && Array.isArray(array[i])) {
      if (
        !doesArrayFits(
          array[i] as Array<unknown>,
          template[i] as Array<unknown>
        )
      )
        return false;
    } else if (isObject(template[i]) && isObject(array[i])) {
      if (
        !doesObjectFits(
          array[i] as Record<string, unknown>,
          template[i] as Record<string, unknown>
        )
      )
        return false;
    } else {
      if (template[i] !== array[i]) return false;
    }
  }
  return true;
};

export const getMessageIflocationRemoved = (
  location: InterProDescription
): string | null => {
  for (let page of removedPages) {
    if (doesObjectFits(location, page.description)) return page.message;
  }
  return null;
};
