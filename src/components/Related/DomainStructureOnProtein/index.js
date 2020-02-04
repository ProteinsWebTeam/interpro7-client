/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const formatStructureInfoObj = data => {
  const features = [];
  for (const key of Object.keys(data)) {
    if (key === 'pdb') continue;
    for (const acc of Object.keys(data[key]).sort()) {
      const f = data[key][acc];
      features.push({
        accession: `${key} - ${acc}`,
        source_database: key.toUpperCase(),
        locations: [
          {
            fragments: f.coordinates,
          },
        ],
        name: f.domain_id,
      });
    }
  }
  return features;
};

const mergeData = (interpro, structures, structureInfo) => {
  const out = {};

  out.interpro = interpro.map(({ metadata, proteins }) => ({
    ...metadata,
    locations: proteins[0].entry_protein_locations,
  }));
  if (structures.length) {
    out.structures = structures
      .map(({ ...obj }) => ({
        label: `${obj.accession}: ${obj.chain}`,
        coordinates: toArrayStructure(obj.structure_protein_locations),
        locations: obj.structure_protein_locations,
        link: `/structure/${obj.source_database}/${obj.accession}`,
        ...obj,
      }))
      .sort((a, b) => a.label > b.label);
  }
  if (structureInfo) {
    out.features = formatStructureInfoObj(structureInfo);
  }
  return out;
};

const UNDERSCORE = /_/g;

/*:: type Props = {
  structures: Array<Object>,
  dataInterPro: Object,
  protein: Object,
  dataStructureInfo: Object,
}; */

class _StructureOnProtein extends PureComponent /*:: <Props> */ {
  static propTypes = {
    structures: T.array.isRequired,
    dataInterPro: T.object,
    protein: T.object,
    dataStructureInfo: T.object,
  };

  render() {
    const { structures, dataInterPro, dataStructureInfo, protein } = this.props;
    if (dataInterPro.loading || dataStructureInfo.loading) {
      return <Loading />;
    }
    const mergedData = Object.entries(
      mergeData(
        dataInterPro.payload ? dataInterPro.payload.results : [],
        structures,
        dataStructureInfo.payload,
      ),
    ).map(([key, value]) => [key.replace(UNDERSCORE, ' '), value]);
    return (
      <ProtVista
        protein={protein}
        data={mergedData}
        title="Structures on protein"
      />
    );
  }
}

const getUrlForInterPro = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    description,
    { cursor: _, ...search },
  ) => {
    const _description = {
      main: { key: 'entry' },
      structure: {
        ...description.structure,
        isFilter: true,
      },
      protein: {
        ...description.protein,
        isFilter: true,
      },
      entry: {
        db: 'InterPro',
      },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: search,
    });
  },
);
const getUrlForStructureInfo = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const _description = {
      main: { key: 'protein' },
      protein: {
        ...description.protein,
      },
    };
    const _search = {
      structureinfo: null,
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: _search,
    });
  },
);
export default loadData({
  propNamespace: 'InterPro',
  getUrl: getUrlForInterPro,
})(
  loadData({
    propNamespace: 'StructureInfo',
    getUrl: getUrlForStructureInfo,
  })(_StructureOnProtein),
);
