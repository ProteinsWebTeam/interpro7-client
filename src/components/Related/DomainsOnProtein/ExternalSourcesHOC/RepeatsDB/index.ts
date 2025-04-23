const HTTP_OK = 200;

export const formatRepeatsDB = ({
  loading,
  status,
  payload,
}: RequestedData<RepeatsDBPayload>) => {
  const panelsData: MinimalFeature[] = [];
  if (!loading && status === HTTP_OK && payload) {
    const data = Object.values(payload.items);
    for (const item of data) {
      const proteinAcc = item.content.chain.structure;
      const locations = [];
      let units = 0;
      for (const loci of item.content.loci) {
        if (loci.type === 'unit') {
          locations.push({
            color: units++ % 2 === 0 ? '#0072b2' : '#d55e00',
            fragments: [
              {
                start: loci.start,
                end: loci.end,
              },
            ],
            description: 'unit',
          });
        } else if (loci.type === 'insertion') {
          locations.push({
            color: '#f0e442',
            fragments: [
              {
                start: loci.start,
                end: loci.end,
              },
            ],
            description: 'insertion',
          });
        }
      }

      if (locations.length > 0) {
        panelsData.push({
          accession: `REPEAT:${proteinAcc}:${panelsData.length}`,
          protein: proteinAcc,
          source_database: 'RepeatsDB',
          type: 'Repeated region',
          locations: locations,
        } as MinimalFeature);
      }
    }
  }
  return panelsData;
};

export default formatRepeatsDB;
