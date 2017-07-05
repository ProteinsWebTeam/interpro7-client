/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import T from 'prop-types';
import { stringify as qsStringify } from 'query-string';

import { createSelector } from 'reselect';
import description2path from 'utils/processLocation/description2path';

import loadData from 'higherOrder/loadData';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

const getUrlFor = createSelector(
  // this one only to memoize it
  db => db,
  db =>
    createSelector(
      state => state.settings.api,
      state => state.newLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        const { mainDetail: _, ..._description } = description;
        let pathname = description2path(_description);
        const search = {};
        if (db === 'Residues') {
          search.residues = null;
        } else {
          pathname += `/entry/${db}`;
        }
        const queryString = qsStringify(search);
        return `${protocol}//${hostname}:${port}${(root + pathname).replace(
          /\/+/g,
          '/'
        )}${queryString ? `?${queryString}` : ''}`;
      }
    )
);
const mergeResidues = residues => {
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

const groupByEntryType = interpro => {
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
  return { out, ipro };
};
const addSignature = (entry, ipro, integrated) => {
  if (entry.entry_integrated in ipro) {
    entry.link = `/entry/${entry.source_database}/${entry.accession}`;
    ipro[entry.entry_integrated].signatures.push(entry);
    ipro[entry.entry_integrated].children.push(entry);
  } else if (entry in integrated) {
    console.error('integrated entry without interpro:', entry);
  }
};

const mergeData = (interpro, integrated, unintegrated, residues) => {
  const { out, ipro } = groupByEntryType(interpro);
  if (unintegrated.length > 0) {
    unintegrated.forEach(
      u => (u.link = `/entry/${u.source_database}/${u.accession}`)
    );
    out.unintegrated = unintegrated;
  }
  for (const entry of integrated.concat(unintegrated)) {
    entry.coordinates = entry.entry_protein_coordinates.coordinates;
    if (residues.hasOwnProperty(entry.accession)) {
      entry.children = entry.residues = mergeResidues({
        [entry.accession]: residues[entry.accession],
      });
      delete residues[entry.accession];
    }
    addSignature(entry, ipro, integrated);
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

  render() {
    const {
      mainData,
      dataInterPro,
      dataIntegrated,
      dataResidues,
      dataUnintegrated,
    } = this.props;
    if (dataInterPro.loading || dataIntegrated.loading) {
      return <div>Loading…</div>;
    }
    const mergedData = mergeData(
      dataInterPro.payload.entries,
      'payload' in dataIntegrated ? dataIntegrated.payload.entries : [],
      'payload' in dataUnintegrated ? dataUnintegrated.payload.entries : [],
      dataResidues.payload
    );
    return (
      <div>
        <DomainArchitecture
          protein={mainData.payload.metadata}
          data={mergedData}
        />
      </div>
    );
  }
};
Index = ['Integrated', 'InterPro', 'Residues', 'Unintegrated'].reduce(
  (Index, db) =>
    loadData({
      getUrl: getUrlFor(db),
      propNamespace: db,
    })(Index),
  Index
);

const DomainSub = ({ data }) =>
  /*: {data: Object, location: {pathname: string}, main: string} */
  <div>
    <h3>
      {data.payload.metadata.accession}
    </h3>
    <Index mainData={data} />
  </div>;
DomainSub.propTypes = {
  data: T.object.isRequired,
};

export default DomainSub;
