const HTTP_OK = 200;

export const formatTED = ({
  loading,
  status,
  payload,
}: RequestedData<TEDPayload>) => {
  if (loading || status !== HTTP_OK || !payload) return [] as MinimalFeature[];

  return payload.data.map((domain: TEDDomain, index: number) => {
    const tedId = (domain.ted_id.match(/TED\d+/) ?? ['TED'])[0];
    return {
      accession: `TED:${tedId}-${index}`,
      protein: domain.uniprot_acc,
      source_database: 'TED',
      type: 'Domain',
      locations: [
        {
          fragments: domain.chopping.split('_').map((segment) => {
            const [start, end] = segment.split('-').map(Number);
            return {
              start: start,
              end: end,
            };
          }),
        },
      ],
    } as MinimalFeature;
  });
};

export default formatTED;
