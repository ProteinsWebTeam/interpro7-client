// @flow

const ACCESSION_PATTERN = /\{\}/;
const ACCESSION_CLEANUP = /^(G3DSA:|SFLDF0*)/i;

export default (db /*: string */) => {
  let pattern = '';
  switch (db.toLowerCase()) {
    case 'cathgene3d':
      pattern = 'http://www.cathdb.info/version/latest/superfamily/{}';
      break;
    case 'cdd':
      pattern = 'https://www.ncbi.nlm.nih.gov/Structure/cdd/cddsrv.cgi?uid={}';
      break;
    case 'hamap':
      pattern = 'https://hamap.expasy.org/signature/{}';
      break;
    case 'panther':
      pattern = 'http://www.pantherdb.org/panther/family.do?clsAccession={}';
      break;
    case 'pfam':
      pattern = 'https://pfam.xfam.org/family/{}';
      break;
    case 'pirsf':
      pattern = 'https://pir.georgetown.edu/cgi-bin/ipcSF?id={}';
      break;
    case 'prints':
      pattern =
        'http://130.88.97.239/cgi-bin/dbbrowser/PRINTS/DoPRINTS.pl?cmd_a=Display&qua_a=none&fun_a=Text&qst_a={}';
      break;
    case 'prodom':
      pattern =
        'http://prodom.prabi.fr/prodom/current/cgi-bin/request.pl?question=DBEN&query={}';
      break;
    case 'profile':
      pattern = 'https://prosite.expasy.org/{}';
      break;
    case 'prosite':
      pattern = 'https://prosite.expasy.org/{}';
      break;
    case 'sfld':
      pattern = 'http://sfld.rbvi.ucsf.edu/django/family/{}/';
      break;
    case 'smart':
      pattern =
        'http://smart.embl-heidelberg.de/smart/do_annotation.pl?DOMAIN={}';
      break;
    case 'superfamily':
      pattern = 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid={}';
      break;
    case 'tigrfams':
      pattern = 'http://www.jcvi.org/cgi-bin/tigrfams/HmmReportPage.cgi?acc={}';
      break;
    default:
      pattern = '';
  }
  if (!pattern) return;
  return (accession /*: string */) =>
    pattern.replace(
      ACCESSION_PATTERN,
      accession.replace(ACCESSION_CLEANUP, ''),
    );
};
