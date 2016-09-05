const LUT = new Map([
  [
    /l|PfamClan/,
    {
      code: 'l',
    },
  ],
  [
    /I|InterPro/,
    {
      code: 'I',
    },
  ],
]);

export default (str, wanted) => {
  for (const [re, obj] of LUT) {
    if (re.test(str.trim())) {
      try {
        return obj[wanted];
      } catch (e) {
        throw Error(`"${wanted}" is not recognized`);
      }
    }
  }
  throw Error(`"${str}" is not a recognized pattern`);
};
