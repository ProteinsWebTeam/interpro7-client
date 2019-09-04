// @flow
const HTTP_OK = 200;

const _getProtvistaTracksData = ({ annotations, condition, type, protein }) => {
  const models = annotations.filter(condition);
  if (models.length) {
    return Object.values(
      models.reduce((agg, { confidence, resource, segments }) => {
        if (!(resource in agg)) {
          agg[resource] = { locations: [], protein };
        }
        agg[resource].accession = `G3D:${resource}-${type}`;
        agg[resource].type = type;
        agg[resource].source_database = resource;
        agg[resource].confidence = confidence;
        agg[resource].locations.push({
          fragments: segments.map(
            ({ uniprot_start: start, uniprot_stop: end }) => ({
              start,
              end,
            }),
          ),
        });
        return agg;
      }, {}),
    );
  }
  return null;
};

export const formatGenome3dIntoProtVistaPanels = (
  {
    loading,
    status,
    payload,
  } /*: {loading: boolean, status: number, payload: Object} */,
) => {
  const panelsData = {};
  if (
    !loading &&
    status === HTTP_OK &&
    payload &&
    payload.data &&
    payload.data.annotations &&
    payload.data.annotations.length
  ) {
    const models = _getProtvistaTracksData({
      annotations: payload.data.annotations,
      condition: ({ type, resource }) =>
        type === 'structural_model' &&
        // Superfamily and gene3d have already beeen integrated in InterPro
        resource.toUpperCase() !== 'SUPERFAMILY' &&
        resource.toUpperCase() !== 'GENE3D',
      type: 'Model',
      protein: payload.data.uniprot_acc,
    });
    if (models)
      panelsData['predicted_3D_structures_(Provided_by_genome3D)'] = models;
    const domains = _getProtvistaTracksData({
      annotations: payload.data.annotations,
      condition: ({ type, resource }) =>
        type !== 'structural_model' &&
        // Superfamily and gene3d have already beeen integrated in InterPro
        resource.toUpperCase() !== 'SUPERFAMILY' &&
        resource.toUpperCase() !== 'GENE3D',
      type: 'Domain',
      protein: payload.data.uniprot_acc,
    });
    if (domains)
      panelsData['predicted_domains_(Provided_by_genome3D)'] = domains;
  }
  return panelsData;
};
