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
      const newURL = (db === 'Residues') ?
        `${(root + pathname).replace('domain_architecture', '')}?${db.toLowerCase()}` :
        (root + pathname)
          .replace('domain_architecture', 'entry')
          .replace(/entry.*$/i, `entry/${db}`);
      return resolve(
        format({protocol, hostname, port, pathname: root}),
        newURL,
      );
    }
  ),
);
const mergeResidues = (residues) => {
  let out = {};
  for (const key of Object.keys(residues)) {
    residues[key].reduce((acc, v) => {
      if (!(v.description in acc)) {
        acc[v.description] = [];
      }
      acc[v.description].push(v);
      return acc;
    }, out);
  }
  out = Object.keys(out).map(a => ({
    accession: a,
    type: 'residue',
    coordinates: [out[a].map(b => [b.from, b.to])],
    name: out[a].reduce((acc, v) => v.name),
    entry: out[a].reduce((acc, v) => v.entry),
    residue: out[a].map(b => b.residue),
    source_database: out[a].map(b => b.source),
    interpro_entry: out[a].map(b => b.interProEntry),
  }));
  return out;
};

const groupByEntryType = (interpro) => {
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
  return {out, ipro};
};

const mergeData = (interpro, integrated, unintegrated, residues) => {
  const {out, ipro} = groupByEntryType(interpro);
  if (unintegrated.length > 0) {
    out.unintegrated = unintegrated;
  }
  for (const entry of integrated.concat(unintegrated)){
    entry.coordinates = entry.entry_protein_coordinates.coordinates;
    if (residues.hasOwnProperty(entry.accession)){
      entry.children = entry.residues = mergeResidues({
        [entry.accession]: residues[entry.accession],
      });
      delete residues[entry.accession];
    }
    if (entry.entry_integrated in ipro){
      ipro[entry.entry_integrated].signatures.push(entry);
      ipro[entry.entry_integrated].children.push(entry);
    } else if (entry in integrated) {
      console.error('integrated entry without interpro:', entry);
    }
  }
  if (Object.keys(residues).length > 0) {
    out.residues = mergeResidues(residues);
  }
  return out;
};

let Index = class extends Component {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object.isRequired,
    dataIntegrated: T.object.isRequired,
    dataUnintegrated: T.object.isRequired,
    dataResidues: T.object.isRequired,
  };

  render(){
    const {mainData, dataInterPro, dataIntegrated, dataResidues, dataUnintegrated} =
      this.props;
    if (dataInterPro.loading || dataIntegrated.loading) {
      return <div>Loading...</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      'payload' in dataIntegrated ? dataIntegrated.payload.entries : [],
      'payload' in dataUnintegrated ? dataUnintegrated.payload.entries : [],
      dataResidues.payload
    );
    return (
      <div>
        <DomainArchitecture protein={mainData.payload.metadata} data={mergedData} />
      </div>
    );
  }
};
Index = ['Integrated', 'InterPro', 'Residues', 'Unintegrated'].reduce(
  (Index, db) => loadData({
    getUrl: getUrlFor(db),
    propNamespace: db,
  })(Index), Index);

const DomainSub = (
  {data}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <h3>{data.payload.metadata.accession}</h3>
    <Index mainData={data} />
  </div>
);
DomainSub.propTypes = {
  data: T.object.isRequired,
};

export default DomainSub;
