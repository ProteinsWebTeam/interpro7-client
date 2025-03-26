const HTTP_OK = 200;
const COLORS = [
  '#4a79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
];

export const formatTED = ({
  loading,
  status,
  payload,
}: RequestedData<TEDPayload>) => {
  if (loading || status !== HTTP_OK || !payload) return [] as MinimalFeature[];

  return [
    {
      accession: `TED:TED`,
      source_database: 'TED',
      locations: payload.data.map((domain: TEDDomain, index: number) => ({
        color: COLORS[index % COLORS.length],
        fragments: domain.chopping.split('_').map((segment) => {
          const [start, end] = segment.split('-').map(Number);
          return {
            start: start,
            end: end,
          };
        }),
      })),
    },
  ] as MinimalFeature[];
};

export default formatTED;
