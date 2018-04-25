// @flow
export const transformFormatted = (txt /*: string */) =>
  txt
    .split(/<\/?p>/i)
    .map(t => t.trim())
    .filter(Boolean);
