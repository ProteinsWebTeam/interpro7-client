const HTTP_OK = 200;

export const formatRepeatsDB = ({
  loading,
  status,
  payload,
}: RequestedData<RepeatsDBPayload>) => {
  const panelsData: MinimalFeature[] = [];
  if (!loading && status === HTTP_OK && payload) {
    for (const repeatDatum of payload || []) {
      for (const feature of repeatDatum.repeatsdb_consensus_majority || []) {
        panelsData.push({
          accession: `REPEAT:${repeatDatum.uniprot_id}:${feature.start}-${feature.end}`,
          protein: repeatDatum.uniprot_id,
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
