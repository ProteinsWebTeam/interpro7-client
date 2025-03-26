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
    const locationsByType = {} as { [key: string]: ProtVistaLocation[] };
    Object.keys(TYPES).forEach((key) => {
      locationsByType[key] = [];
    });
    for (const region of payload.disprot_consensus.full) {
      const key = region.type;
      if (locationsByType[key]) {
        locationsByType[key].push({
          fragments: [
            {
              start: region.start,
              end: region.end,
            },
          ],
        } as ProtVistaLocation);
      }
    }

    Object.keys(locationsByType).forEach((key) => {
      const locations = locationsByType[key];
      if (locations.length > 0) {
        panelsData.push({
          accession: `DISPROT:${panelsData.length + 1}`,
          protein: payload.acc,
          source_database: 'DisProt',
          type: TYPES[key],
          locations: locations,
          color: '#A7662B',
        } as MinimalFeature);
      }
    });
  }

  return panelsData;
};

export default formatDisProt;
