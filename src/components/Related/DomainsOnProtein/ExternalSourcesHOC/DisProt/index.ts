const HTTP_OK = 200;

const TYPES: { [key: string]: string } = {
  F: 'Function region',
  S: 'Order state',
  D: 'Disorder state',
  T: 'Transition',
  I: 'Transition with interaction',
};

export const formatDisProt = ({
  loading,
  status,
  payload,
}: RequestedData<DisProtPayload>) => {
  const panelsData: MinimalFeature[] = [];
  if (!loading && status === HTTP_OK && payload) {
    let i = 1;
    for (const region of payload.disprot_consensus.full) {
      panelsData.push({
        accession: `DISPROT:${i++}`,
        protein: payload.acc,
        source_database: 'DisProt',
        type: TYPES[region.type] || '',
        locations: [
          {
            fragments: [
              {
                start: region.start,
                end: region.end,
              },
            ],
          },
        ],
      } as MinimalFeature);
    }
  }
  return panelsData;
};

export default formatDisProt;
