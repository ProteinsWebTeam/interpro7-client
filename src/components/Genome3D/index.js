// @flow
const HTTP_OK = 200;

const _getProtvistaTracksData = ({ annotations, condition, type, protein }) => {
  const models = annotations.filter(condition);
  if (models.length) {
    const tracks = Object.values(
      models.reduce((agg, { metadata, locations }) => {
        if (!(metadata.resource in agg)) {
          agg[metadata.resource] = { protein };
        }
        agg[
          metadata.resource
        ].accession = `G3D:${metadata.resource}-${metadata.type}`;
        agg[metadata.resource].type = type;
        agg[metadata.resource].source_database = metadata.resource;
        const addedInfoLocation = {
          confidence: metadata.confidence,
          fragments: locations[0].fragments,
        };

        // Saving the fragment end to sort for later
        if (agg[metadata.resource].locationEnd) {
          agg[metadata.resource].locationEnd =
            agg[metadata.resource].locationEnd < locations[0].fragments[0].end
              ? locations[0].fragments[0].end
              : agg[metadata.resource].locationEnd;
        } else {
          agg[metadata.resource].locationEnd = locations[0].fragments[0].end;
        }

        if (agg[metadata.resource].locations) {
          const presentLocations = agg[metadata.resource].locations;
          presentLocations.push(addedInfoLocation);
          agg[metadata.resource].locations = presentLocations;
        } else {
          agg[metadata.resource].locations = [addedInfoLocation];
        }
        return agg;
      }, {}),
    );
    return tracks.sort((a, b) => a.locationEnd - b.locationEnd);
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
      condition: ({ metadata }) =>
        metadata.type === 'PREDICTED_3D_STRUCTURE' &&
        // Superfamily and gene3d have already beeen integrated in InterPro
        metadata.resource.toUpperCase() !== 'SUPERFAMILY' &&
        metadata.resource.toUpperCase() !== 'GENE3D',
      type: 'Model',
      protein: payload.data.uniprot_acc,
    });
    if (models)
      panelsData['predicted_3D_structures_(Provided_by_genome3D)'] = models;
    const domains = _getProtvistaTracksData({
      annotations: payload.data.annotations,
      condition: ({ metadata }) =>
        metadata.type !== 'PREDICTED_3D_STRUCTURE' &&
        // Superfamily and gene3d have already beeen integrated in InterPro
        metadata.resource.toUpperCase() !== 'SUPERFAMILY' &&
        metadata.resource.toUpperCase() !== 'GENE3D',
      type: 'Domain',
      protein: payload.data.uniprot_acc,
    });
    if (domains)
      panelsData['predicted_domains_(Provided_by_genome3D)'] = domains;
  }
  return panelsData;
};
