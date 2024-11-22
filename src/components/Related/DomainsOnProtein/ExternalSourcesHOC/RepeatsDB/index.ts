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
      for (const feature of item.content.loci) {
        if (feature.type === 'region')
          panelsData.push({
            accession: `REPEAT:${proteinAcc}:${feature.start}-${feature.end}`,
            protein: proteinAcc,
            source_database: 'RepeatsDB',
            type: 'Consensus',
            locations: [
              {
                fragments: [
                  {
                    start: feature.start,
                    end: feature.end,
                  },
                ],
              },
            ],
          } as MinimalFeature);
      }
    }
  }
  return panelsData;
};

export default formatRepeatsDB;
