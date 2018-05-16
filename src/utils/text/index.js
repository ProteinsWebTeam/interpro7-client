// @flow
export const transformFormatted = (txt /*: string */) =>
  txt
    .split(/<\/?p>/i)
    .map(t => t.trim())
    .filter(Boolean);

export const unescape = (txt /*: string */) =>
  txt
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
