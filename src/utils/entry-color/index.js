// @flow
import ColorHash from 'color-hash/lib/color-hash';

import config from 'config';

const colorHash = new ColorHash();

/*:: type ColorMode = 'ACCESSION' | 'MEMBER_DB' | 'DOMAIN_RELATIONSHIP'; */
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
}; */

export const getTrackColor = (
  entry /*: Entry */,
  colorMode /*: ColorMode */,
) => {
  let acc;
  // eslint-disable-next-line default-case
  switch (colorMode) {
    case EntryColorMode.ACCESSION:
      acc = entry.accession
        .toLowerCase()
        .split('')
        .reverse()
        .join('');
      return colorHash.hex(acc);
    case EntryColorMode.MEMBER_DB:
      return config.colors.get(entry.source_database);
    case EntryColorMode.DOMAIN_RELATIONSHIP:
      if (entry.source_database.toLowerCase() === 'interpro') {
        acc = entry.accession
          .split('')
          .reverse()
          .join('');
        return colorHash.hex(acc);
      }
      if (entry.parent) {
        acc = entry.parent.accession
          .split('')
          .reverse()
          .join('');
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
