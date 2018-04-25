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

const getUrlFor = createSelector(
  // this one only to memoize it
  db => db,
  db =>
    createSelector(
      state => state.settings.api,
      state => state.customLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        // copy description
        const _description = {};
        for (const [key, value] of Object.entries(description)) {
          _description[key] = value.isFilter ? {} : { ...value };
        }
        // brand new search
        const search = {};
        if (db === 'StructureInfo') {
          search.structureinfo = null;
        } else {
          _description.entry.isFilter = true;
          _description.entry.db = db;
        }
        // build URL
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(_description),
          query: search,
        });
      },
    ),
);

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const mergeData = (interpro, structures) => {
  const ipro = {};
  const out = interpro.reduce((acc, val) => {
    val.signatures = [];
    val.children = [];
    val.coordinates = toArrayStructure(val.entry_protein_locations);
    val.locations = val.entry_protein_locations;
    val.link = `/entry/${val.source_database}/${val.accession}`;
    ipro[val.accession] = val;
    if (!(val.entry_type in acc)) {
      acc[val.entry_type] = [];
    }
    acc[val.entry_type].push(val);
    return acc;
  }, {});
  if (structures.length) {
    out.structures = structures
      .map(({ ...obj }) => ({
        label: `${obj.accession}: ${obj.chain}`,
        coordinates: toArrayStructure(obj.protein_structure_locations),
        locations: obj.protein_structure_locations,
        link: `/structure/${obj.source_database}/${obj.accession}`,
        ...obj,
      }))
      .sort((a, b) => a.label > b.label);
  }
  // if (structureInfo && structureInfo.prediction) {
  //   out.predictions = formatStructureInfoObj(structureInfo.prediction);
  // }
  // if (structureInfo && structureInfo.feature) {
  //   out.features = formatStructureInfoObj(structureInfo.feature);
  // }
  return out;
};

const UNDERSCORE = /_/g;

class _StructureOnProtein extends PureComponent {
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
        dataInterPro.payload ? dataInterPro.payload.entries : [],
        structures,
        dataStructureInfo.payload,
      ),
    ).map(([key, value]) => [key.replace(UNDERSCORE, ' '), value]);
    return <ProtVista protein={protein} data={mergedData} />;
  }
}

const StructureOnProtein = ['InterPro', 'StructureInfo'].reduce(
  (Index, db) =>
    loadData({
      getUrl: getUrlFor(db),
      propNamespace: db,
    })(Index),
  _StructureOnProtein,
);

export default StructureOnProtein;
