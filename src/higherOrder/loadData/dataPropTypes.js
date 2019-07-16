import T from 'prop-types';

export const metadataPropType = T.shape({
  metadata: T.shape({
    accession: T.string,
    sequence: T.string,
    name: T.shape({
      name: T.string,
    }),
  }),
});

export const resultsPropType = T.shape({
  results: T.arrayOf([metadataPropType]),
});
const interProScanUnitPropType = T.shape({
  sequence: T.string.isRequired,
  xref: T.shape({
    0: T.shape({
      identifier: T.string,
    }).isRequired,
  }).isRequired,
});
export const interProScanPropType = T.shape({
  results: T.shape(
    {
      0: interProScanUnitPropType.isRequired,
    }.isRequired,
  ),
});

export const dataPropType = T.shape({
  loading: T.bool.isRequired,
  payload: T.oneOfType([
    metadataPropType,
    resultsPropType,
    interProScanPropType,
    interProScanUnitPropType,
  ]),
  status: T.number,
  ok: T.bool,
  progress: T.number,
  url: T.string,
});
