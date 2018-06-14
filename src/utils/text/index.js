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

export const subsetText = (
  text /*: string */,
  from /*: number */,
  length /*: number */,
) => {
  const substring = text.substr(from, length);
  let output = substring;
  if (!text.startsWith(substring)) output = `…${output}`;
  if (!text.endsWith(substring)) output = `${output}…`;
  return output;
};

export const findStart = (centerOfHighlight /*: number */) => (
  text /*: string */,
  textToHighlight /*:: ?: ?string  */,
  maxLength /*: number */,
) => {
  // No text to highlight? Just use 0 as start
  if (!textToHighlight) return 0;
  // If the text is shorter than the maxLength, just use 0
  if (text.length <= maxLength) return 0;
  // find index of first letter of first match of highlighted text in text
  const index = text.toLowerCase().indexOf(textToHighlight.toLowerCase());
  // if no match, start at the beginning
  if (index === -1) return 0;
  // if the full match is within the maximum length of text to display,
  // start at the beginning
  if (index + textToHighlight.length <= maxLength) return 0;
  // center the index, to use the middle of the highlight as a reference
  const centeredIndex = index + textToHighlight.length / 2;
  // find start, using previous index as center, center of highlight to adjust
  const start = Math.round(centeredIndex - maxLength * centerOfHighlight);
  // if start position is too close to the end of the text, move the start
  if (start + maxLength > text.length) return text.length - maxLength;
  // after all those checks, if we're still here, return this start position
  return start;
};
