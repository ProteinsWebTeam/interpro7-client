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

/*:: type RGB = {
  r: number,
  g: number,
  b: number
}; */

export function hexToRgb(hex /*: string */) /*: ?RGB */ {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const rgb = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
    return rgb;
  }
}
