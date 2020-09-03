import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import { ENTRY_DBS } from 'utils/url-patterns';

const otherEndpoints = {
  protein: 'uniprot',
  structure: 'pdb',
  proteome: 'uniprot',
  taxonomy: 'uniprot',
  set: 'all',
};
const isDescriptionValid = (description) => {
  try {
    descriptionToDescription(description);
    return true;
  } catch (error) {
    return false;
  }
};

const getURLByAccession = (accession) => {
  const directLinkDescription = {
    main: { key: 'entry' },
    entry: {
      accession: accession,
      db: 'InterPro',
    },
  };
  // First check for exact match in InterPro
  if (isDescriptionValid(directLinkDescription)) {
    return directLinkDescription;
  }
  // Then for exact match in other member DBs
  for (const db of ENTRY_DBS) {
    directLinkDescription.entry.db = db;
    if (isDescriptionValid(directLinkDescription)) {
      return directLinkDescription;
    }
  }
  // Then cehcking other endpoints
  for (const [ep, db] of Object.entries(otherEndpoints)) {
    const directEndpointLinkDescription = {
      main: { key: ep },
      [ep]: {
        accession: accession,
        db,
      },
    };
    if (isDescriptionValid(directEndpointLinkDescription)) {
      return directEndpointLinkDescription;
    }
  }

  return null;
};

export default getURLByAccession;
