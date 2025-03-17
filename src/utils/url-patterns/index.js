// @flow
import config from 'config';

const ACCESSION_PATTERN = /{}/;
const ACCESSION_CLEANUP = [
  [/^G3DSA:/i, ''],
  [/^SFLDF0*(\d+)$/i, 'family/$1'],
  [/^SFLDS0*(\d+)$/i, 'superfamily/$1'],
  [/^SFLDG0*(\d+)$/i, 'subgroup/$1'],
];

// TODO: have consistent data to eventually remove this

export const iproscan2urlDB = (db /*: string */) =>
  new Map([
    ['TIGRFAM', 'tigrfams'],
    ['NCBIfam', 'ncbifam'],
    ['AntiFam', 'antifam'],
    ['PROSITE_PROFILES', 'profile'],
    ['PROSITE_PATTERNS', 'prosite'],
    ['SUPERFAMILY', 'ssf'],
    ['GENE3D', 'cathgene3d'],
  ]).get(db) || db.toLowerCase();

export const ebiSearch2urlDB = (db /*: string */) =>
  new Map([
    ['TIGRFAM', 'tigrfams'],
    ['NCBIfam', 'ncbifam'],
    ['AntiFam', 'antifam'],
    ['PROSITE profiles', 'profile'],
    ['PROSITE patterns', 'prosite'],
    ['SUPERFAMILY', 'ssf'],
    ['CATH-Gene3D', 'cathgene3d'],
  ]).get(db) || db.toLowerCase();

export const ENTRY_DBS = [
  'panther',
  'pfam',
  'cathgene3d',
  'ssf',
  'cdd',
  'profile',
  'smart',
  'tigrfams',
  'ncbifam',
  'antifam',
  'prosite',
  'prints',
  'hamap',
  'pirsf',
  'sfld',
  'interpro',
];

export const memberDbURL = new Map([
  ['cathgene3d', '//www.cathdb.info/'],
  ['cdd', '//www.ncbi.nlm.nih.gov/cdd/'],
  ['hamap', '//hamap.expasy.org/'],
  ['panther', '//pantherdb.org/'],
  ['pfam', '//www.ebi.ac.uk/interpro/entry/pfam/'],
  ['pirsf', '//proteininformationresource.org/pirsf/'],
  ['prints', `${config.root.readthedocs.href}prints.html`],
  ['profile', '//prosite.expasy.org/'],
  ['prosite', '//prosite.expasy.org/'],
  ['smart', 'http://smart.embl-heidelberg.de/'],
  ['ssf', 'http://supfam.org/SUPERFAMILY/'],
  ['tigrfams', 'https://www.ncbi.nlm.nih.gov/genome/annotation_prok/tigrfams/'],
  ['ncbifam', 'https://www.ncbi.nlm.nih.gov/genome/annotation_prok/evidence/'],
  ['antifam', '//www.ebi.ac.uk/interpro/entry/antifam/'],
]);

export default (db /*: string */) => {
  const patterns = new Map([
    ['cathgene3d', 'http://www.cathdb.info/version/latest/superfamily/{}'],
    ['cdd', '//www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid={}'],
    ['hamap', '//hamap.expasy.org/signature/{}'],
    ['panther', 'http://www.pantherdb.org/panther/family.do?clsAccession={}'],
    ['pfam', '//www.ebi.ac.uk/interpro/entry/pfam/{}'],
    ['profile', '//prosite.expasy.org/{}'],
    ['prosite', '//prosite.expasy.org/{}'],
    ['sfld', 'http://sfld.rbvi.ucsf.edu/archive/django/{}'],
    [
      'smart',
      'http://smart.embl-heidelberg.de/smart/do_annotation.pl?DOMAIN={}',
    ],
    ['ssf', 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid={}'],
    [
      'tigrfams',
      'https://www.ncbi.nlm.nih.gov/genome/annotation_prok/evidence/{}/',
    ],
    [
      'ncbifam',
      'https://www.ncbi.nlm.nih.gov/genome/annotation_prok/evidence/{}/',
    ],
    ['antifam', '//www.ebi.ac.uk/interpro/entry/antifam/{}'],
  ]);
  const pattern = patterns.get(db.toLowerCase()) || '';
  if (!pattern) return;
  return (accession /*: string */) =>
    pattern.replace(
      ACCESSION_PATTERN,
      ACCESSION_CLEANUP.reduce(
        (result, [regexp, newSubstr]) => result.replace(regexp, newSubstr),
        accession,
      ),
    );
};
