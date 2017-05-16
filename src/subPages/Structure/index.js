/* eslint-disable no-param-reassign */
import React, {Component} from 'react';
import T from 'prop-types';

import Related from 'components/Related';

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

let Index = class extends Component {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object,
    dataStructureinfo: T.object,
  };

  render(){
    const {mainData, dataInterPro, dataStructureinfo} = this.props;
    if (dataInterPro.loading || dataStructureinfo.loading) {
      return <div>Loading...</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      mainData.payload.structures,
      dataStructureinfo.payload,
    );
    return (
      <div>
        <DomainArchitecture protein={mainData.payload.metadata} data={mergedData} />
      </div>
    );
  }
};
Index = ['InterPro', 'Structureinfo'].reduce(
  (Index, db) => loadData({
    getUrl: getUrlFor(db),
    propNamespace: db,
  })(Index), Index);

const StructureSub = (
  {data, location: {pathname}, main}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <Index mainData={data} />
    <Related
      data={data}
      main={main}
      secondary="structure"
      pathname={pathname}
    />
  </div>
);
StructureSub.propTypes = {
  data: T.object.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  main: T.string.isRequired,
};

export default StructureSub;
