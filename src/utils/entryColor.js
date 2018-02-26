import ColorHash from 'color-hash/lib/color-hash';

const colorHash = new ColorHash();

// TODO: refactor to have a single place for colors
const colorsByDB = {
  cathgene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6',
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#fbbddd',
  prints: '#54c75f',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff8d8d',
  ssf: '#686868',
  tigrfams: '#56b9a6',
  interpro: '#2daec1',
  pdb: '#74b360',
};

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
      return colorsByDB[entry.source_database.toLowerCase()];
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
