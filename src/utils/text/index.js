// @flow
export const transformFormatted = (txt /*: string */) =>
  txt
    .split(/<\/?p>/i)
    .map((t) => t.trim())
    .filter(Boolean);

export const unescape = (txt /*: string */) =>
  txt.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

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

export const findStart =
  (centerOfHighlight /*: number */) =>
  (
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

export const location2html = (
  locations /*: Array<Object> */,
  accession /*: string */,
  name /*: string */,
  sourceDatabase /*: string */,
) => {
  let text = '';
  if (accession) text += `<b>${accession}</b><br/>`;
  if (name) text += `${name}<br/>`;
  if (sourceDatabase) text += `${sourceDatabase}<br/>`;
  if (locations) {
    text += `${locations
      .map(
        (loc) =>
          `<p>${loc.fragments
            .map((f) => `${f.start}-${f.end}`)
            .join('<br/>')}</p>`,
      )
      .join('')}`;
  }
  return text;
};

export const getTextForLabel = (
  entry /*: {
    accession: string;
    name: string;
    short_name: string;
  } */,
  label /*: {
    accession: boolean;
    name: boolean;
    short: boolean;
  } */,
) /*: string */ => {
  let text = '';

  /* Always display accessions for IPRO entries */
  if (entry.accession.startsWith('IPR')) {
    text = entry.accession;
  } else {
    text = entry.source_database + ': ';
    if (entry.short_name) text += entry.short_name;
    else if (entry.name) text += entry.name;
    else if (entry.accession) text += entry.accession;
    if (text.length > 20) {
      text = text.slice(0, 20) + '..';
    }
  }

  return text;
};
