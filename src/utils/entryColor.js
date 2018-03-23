import ColorHash from 'color-hash/lib/color-hash';
import config from 'config';

const colorHash = new ColorHash();

export const EntryColorMode = {
  ACCESSION: 'ACCESSION',
  MEMBER_DB: 'MEMBER_DB',
  DOMAIN_RELATIONSHIP: 'DOMAIN_RELATIONSHIP',
};

export const getTrackColor = (entry, colorMode = null) => {
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
      return config.color.get(entry.source_database);
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
      break;
    default:
      return 'rgb(170,170,170)';
  }
  return 'rgb(170,170,170)';
};
