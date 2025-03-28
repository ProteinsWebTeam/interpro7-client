const HTTP_OK = 200;

const TYPES: { [key: string]: [string, string] } = {
  F: ['Function', '#b01e1c'],
  S: ['Ordered', '#008de5'],
  D: ['Disorder', '#a7662b'],
  T: ['Transition', '#761e6f'],
  I: ['Transition with interaction', '#761e6f'],
};

export const formatDisProt = ({
  loading,
  status,
  payload,
}: RequestedData<DisProtPayload>) => {
  const panelsData: MinimalFeature[] = [];
  if (!loading && status === HTTP_OK && payload) {
    const locations = [];
    for (const region of payload.disprot_consensus.full) {
      if (TYPES[region.type]) {
        const [description, color] = TYPES[region.type];
        locations.push({
          color: color,
          description: description,
          fragments: [
            {
              start: region.start,
              end: region.end,
            },
          ],
        } as ProtVistaLocation);
      }
    }

    if (locations.length > 0) {
      panelsData.push({
        accession: `DISPROT:${panelsData.length + 1}`,
        protein: payload.acc,
        source_database: 'DisProt',
        locations: locations,
      } as MinimalFeature);
    }
  }

  return panelsData;
};

export default formatDisProt;
