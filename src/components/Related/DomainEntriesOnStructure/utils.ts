export type DataForProteinChain = {
  protein: {
    accession: string;
    length: number;
  }[];
  sequence: {
    sequence: string;
    length: number;
  };
  data: {
    [key: string]: Array<{
      accession: string;
      name?: string;
      short_name?: string;
      coordinates?: number[][][];
      source_database: string;
      locations: ProtVistaLocation[];
      link?: string;
      children?: unknown;
      chain: string;
      protein?: string;
      type: string;
    }>;
  };
  chain: string;
  isChimeric?: boolean;
};

export const mergeChimericProteins = (
  data: Record<string, DataForProteinChain>,
): Record<string, DataForProteinChain> => {
  // New combined accession <uniprot_acc>,<uniprot_acc>, etc..
  const proteinViewerIdentifier = Object.keys(data).join(',');

  // List of the data coming in from the different UniProt proteins on the same chain
  const proteinSplitData: DataForProteinChain[] = JSON.parse(
    JSON.stringify(Object.values(data)),
  ); //deep copy;

  // Initialize new data structure, copying info from the first protein and edit it
  let newData: Record<string, DataForProteinChain> = {};
  newData[proteinViewerIdentifier] = JSON.parse(
    JSON.stringify(Object.values(data)[0]),
  ); //deep copy of first protein

  newData[proteinViewerIdentifier]['protein'][0].accession =
    proteinViewerIdentifier;
  newData[proteinViewerIdentifier]['data'] = {};

  // Cycle through the "domain", "family", etc.. sections for each UniProt protein and create new objects in newData
  proteinSplitData.map((protein) => {
    Object.entries(protein['data']).map((section) => {
      if (newData[proteinViewerIdentifier]['data'][section[0]]) {
        if (section[0] !== 'secondary_structure') {
          // Avoid track duplication for secondary structure
          newData[proteinViewerIdentifier]['data'][section[0]] = newData[
            proteinViewerIdentifier
          ]['data'][section[0]].concat(section[1]);
        }
      } else {
        newData[proteinViewerIdentifier]['data'][section[0]] = section[1];
      }
    });
  });

  return newData;
};
