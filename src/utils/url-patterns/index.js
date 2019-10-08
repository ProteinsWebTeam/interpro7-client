// @flow

const ACCESSION_PATTERN = /\{\}/;
const ACCESSION_CLEANUP = /^(G3DSA:|SFLDF0*)/i;

// TODO: have consistent data to eventually remove this

export const iproscan2urlDB = (db /*: string */) =>
  new Map([
    ['TIGRFAM', 'tigrfams'],
    ['PROSITE_PROFILES', 'profile'],
    ['PROSITE_PATTERNS', 'prosite'],
    ['SUPERFAMILY', 'ssf'],
    ['GENE3D', 'cathgene3d'],
  ]).get(db) || db.toLowerCase();

export const ebiSearch2urlDB = (db /*: string */) =>
  new Map([
    ['TIGRFAM', 'tigrfams'],
    ['PROSITE profiles', 'profile'],
    ['PROSITE patterns', 'patterns'],
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
  'prosite',
  'prints',
  'hamap',
  'pirsf',
  'sfld',
  'interpro',
];
export default (db /*: string */) => {
  const patterns = new Map([
    ['cathgene3d', 'http://www.cathdb.info/version/latest/superfamily/{}'],
    ['cdd', '//www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid={}'],
    ['hamap', '//hamap.expasy.org/signature/{}'],
    ['panther', 'http://www.pantherdb.org/panther/family.do?clsAccession={}'],
    ['pfam', '//pfam.xfam.org/family/{}'],
    ['pirsf', '//pir.georgetown.edu/cgi-bin/ipcSF?id={}'],
    [
      'prints',
      'http://www.bioinf.manchester.ac.uk/cgi-bin/dbbrowser/sprint/searchprintss.cgi?prints_accn={}&display_opts=Prints&category=None&queryform=false&regexpr=off',
    ],
    ['profile', '//prosite.expasy.org/{}'],
    ['prosite', '//prosite.expasy.org/{}'],
    ['sfld', 'http://sfld.rbvi.ucsf.edu/django/family/{}/'],
    [
      'smart',
      'http://smart.embl-heidelberg.de/smart/do_annotation.pl?DOMAIN={}',
    ],
    ['ssf', 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid={}'],
    [
      'tigrfams',
      'http://www.jcvi.org/cgi-bin/tigrfams/HmmReportPage.cgi?acc={}',
    ],
  ]);
  const pattern = patterns.get(db.toLowerCase()) || '';
  if (!pattern) return;
  return (accession /*: string */) =>
    pattern.replace(
      ACCESSION_PATTERN,
      accession.replace(ACCESSION_CLEANUP, ''),
    );
};
