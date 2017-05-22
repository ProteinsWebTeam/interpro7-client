/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import {createSelector} from 'reselect';
import {format, resolve} from 'url';

import loadData from 'higherOrder/loadData';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

const getUrlFor = createSelector(// this one only to memoize it
  db => db,
  db => createSelector(
    state => state.settings.api,
    state => state.location.pathname,
    ({protocol, hostname, port, root}, pathname) => {
      const newURL = (db === 'Structureinfo') ?
        `${(root + pathname).replace('/structure/pdb', '')}?${db.toLowerCase()}` :
        (root + pathname)
          .replace('structure', 'entry')
          .replace(/entry.*$/i, `entry/${db}`);
      return resolve(
        format({protocol, hostname, port, pathname: root}),
        newURL,
      );
    }
  ),
);
const formatStructureInfoObj = obj => {
  const out = [];
  for (const db of Object.keys(obj)) {
    if (db.toLowerCase() !== 'pdbe') {
      for (const acc of Object.keys(obj[db])) {
        out.push({
          accession: acc,
          source_database: db,
          coordinates: [obj[db][acc].coordinates.map(
            x => [x.start, x.end]
          )],
        });
      }
    }
  }
  return out;
};

const mergeData = (interpro, structures, structureInfo) => {
  const ipro = {};
  const out = interpro.reduce((acc, val) => {
    val.signatures = [];
    val.children = [];
    val.coordinates = val.entry_protein_coordinates.coordinates;
    val.link = `/entry/${val.source_database}/${val.accession}`;
    ipro[val.accession] = val;
    if (!(val.entry_type in acc)) {
      acc[val.entry_type] = [];
    }
    acc[val.entry_type].push(val);
    return acc;
  }, {});
  if (structures.length > 0) {
    out.structures = structures.map(({...obj}) => ({
      label: `${obj.accession}: ${obj.chain}`,
      coordinates: [obj.protein_structure_coordinates.coordinates],
      link: `/structure/${obj.source_database}/${obj.accession}`,
      ...obj,
    })).sort((a, b) => a.label > b.label);
  }
  if (structureInfo && structureInfo.prediction) {
    out.predictions = formatStructureInfoObj(structureInfo.prediction);
  }
  if (structureInfo && structureInfo.feature) {
    out.features = formatStructureInfoObj(structureInfo.feature);
  }
  return out;
};

let StructureOnProtein = class extends Component {
  static propTypes = {
    structures: T.array.isRequired,
    dataInterPro: T.object,
    protein: T.object,
    dataStructureinfo: T.object,
  };

  render(){
    const {structures, dataInterPro, dataStructureinfo, protein} = this.props;
    if (dataInterPro.loading || dataStructureinfo.loading) {
      return <div>Loading...</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      structures,
      dataStructureinfo.payload,
    );
    return (
      <div>
        <DomainArchitecture protein={protein} data={mergedData} />
      </div>
    );
  }
};
StructureOnProtein = ['InterPro', 'Structureinfo'].reduce(
  (Index, db) => loadData({
    getUrl: getUrlFor(db),
    propNamespace: db,
  })(Index), StructureOnProtein);

export default StructureOnProtein;
