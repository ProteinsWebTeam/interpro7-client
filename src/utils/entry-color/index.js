import ColorHash from 'color-hash';

import config from 'config';

// default values for version 1.X of colorhash
/* eslint-disable no-magic-numbers */
const colorHash = new ColorHash({
  hash: 'bkdr',
  saturation: [0.65, 0.35, 0.5],
  lightness: [0.65, 0.35, 0.5],
});
/* eslint-enable no-magic-numbers */

/*:: export type ColorMode = 'ACCESSION' | 'MEMBER_DB' | 'DOMAIN_RELATIONSHIP'; */
/*:: type ColorModeMap = {[string]: ColorMode}; */

export const EntryColorMode /*: ColorModeMap */ = {
  ACCESSION: 'ACCESSION',
  MEMBER_DB: 'MEMBER_DB',
  DOMAIN_RELATIONSHIP: 'DOMAIN_RELATIONSHIP',
};

/*:: type Entry = {
  accession: string,
  source_database: string,
  parent?: Entry,
  integrated?: string
}; */

export const getTrackColor = (
  entry /*: Entry */,
  colorMode /*: ColorMode */,
) => {
  if (entry.color) return entry.color;
  let acc;
  // eslint-disable-next-line default-case
  switch (colorMode) {
    case EntryColorMode.ACCESSION:
      acc = entry.accession.startsWith('residue:')
        ? entry.accession
            .split('residue:')[1]
            .toLowerCase()
            .split('')
            .reverse()
            .join('')
        : entry.accession.toLowerCase().split('').reverse().join('');
      return colorHash.hex(acc);
    case EntryColorMode.MEMBER_DB:
      return config.colors.get(entry.source_database);
    case EntryColorMode.DOMAIN_RELATIONSHIP:
      if (entry.source_database) {
        if (entry.source_database.toLowerCase() === 'interpro') {
          acc = entry.accession.split('').reverse().join('');
          return colorHash.hex(acc);
        }

        if (entry.source_database.toLowerCase() === 'mobidblt') {
          return colorHash.hex('MobiDB-lite: Consensus Disorder Prediction');
        }
      }
      if (entry.parent && entry.parent.accession) {
        acc = entry.parent.accession.split('').reverse().join('');
        return colorHash.hex(acc);
      }

      if (entry.integrated) {
        acc = entry.integrated.split('').reverse().join('');
        return colorHash.hex(acc);
      }
  }
  return config.colors.get();
};

const HEX_REGEXP = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/*:: type RGB = {
  r: number,
  g: number,
  b: number
}; */

/**
 * Transforms hex string for color into rgb object
 * @param {string} hex hex string representing a color
 * @returns {{r: number, g: number, b: number}} RGB object containing number
 */
export const hexToRgb = (hex /*: string */) /*: ?RGB */ => {
  const [, r = 0, g = 0, b = 0] = hex.match(HEX_REGEXP) || [];
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
};
