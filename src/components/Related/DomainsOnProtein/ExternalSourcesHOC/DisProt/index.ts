const HTTP_OK = 200;

export const formatDisProt = ({
  loading,
  status,
  payload,
}: RequestedData<DisProtPayload>) => {
  const panelsData: MinimalFeature[] = [];
  if (!loading && status === HTTP_OK && payload) {
    for (const region of payload.regions) {
      panelsData.push({
        accession: `DISPROT:${region.region_id}`,
        protein: payload.acc,
        source_database: 'DisProt',
        type: region.term_namespace,
        locations: [
          {
            fragments: [
              {
                start: region.start,
                end: region.end,
              },
            ],
            term_name: region.term_name,
            ec_name: region.ec_name,
            released: region.released,
          },
        ],
      } as MinimalFeature);
    }
  }
  return panelsData;
};

export default formatDisProt;
