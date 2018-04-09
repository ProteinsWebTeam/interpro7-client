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
    default:
      return config.colors.get();
  }
};
