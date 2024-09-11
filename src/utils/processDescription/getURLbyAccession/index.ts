import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import { ENTRY_DBS } from 'utils/url-patterns';

const otherEndpoints = {
  protein: 'uniprot',
  structure: 'pdb',
  proteome: 'uniprot',
  taxonomy: 'uniprot',
  set: 'all',
};
const isDescriptionValid = (description: InterProPartialDescription) => {
  try {
    descriptionToDescription(description);
    return true;
  } catch (error) {
    return false;
  }
};

const getURLByAccession = (accession?: string | null) => {
  const directLinkDescription = {
    main: { key: 'entry' },
    entry: {
      accession: accession,
      db: 'InterPro',
    },
  } as InterProPartialDescription;
  // First check for exact match in InterPro
  if (isDescriptionValid(directLinkDescription)) {
    return directLinkDescription;
  }
  // Then for exact match in other member DBs
  for (const db of ENTRY_DBS) {
    if (!directLinkDescription.entry) {
      directLinkDescription.entry = {};
    }
    directLinkDescription.entry.db = db;
    if (isDescriptionValid(directLinkDescription)) {
      return directLinkDescription;
    }
  }
  // Then checking other endpoints
  for (const [ep, db] of Object.entries(otherEndpoints)) {
    const directEndpointLinkDescription = {
      main: { key: ep },
      [ep]: {
        accession: accession,
        db,
      },
    } as InterProPartialDescription;
    if (isDescriptionValid(directEndpointLinkDescription)) {
      return directEndpointLinkDescription;
    }
  }

  return null;
};

export default getURLByAccession;
