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
    source_database: string;
  } */,
  label /*: {
    accession: boolean;
    name: boolean;
    short: boolean;
  } */,
) /*: string */ => {
  let textList = [];

  if (label.short && entry.short_name) textList.push(entry.short_name);
  if (label.name && entry.name) textList.push(entry.name);
  if (label.accession && entry.accession) textList.push(entry.accession);

  // If the only selected label by option is not available, select the first available

  if (textList.length === 0) {
    const priorityList = ['short_name', 'name', 'accession'];
    for (let i = 0; i < priorityList.length; i++) {
      const label = entry[priorityList[i]];
      if (label) {
        textList.push(label);
        break;
      }
    }
  }

  let text = textList.join(' - ');

  if (!entry.accession.startsWith('IPR') && entry.source_database) {
    text = entry.source_database.toUpperCase() + ': ' + text;
  }

  // Use :nMatch to distiguish the tracks during rendering on PV, but don't show the suffix on labels and tooltips
  text = text.replace(':nMatch', '');

  return text;
};
