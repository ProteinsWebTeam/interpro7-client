/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import DomainArchitecture from 'components/Protein/DomainArchitecture';
import Loading from 'components/SimpleCommonComponents/Loading';

const getUrlFor = createSelector(
  // this one only to memoize it
  db => db,
  db =>
    createSelector(
      state => state.settings.api,
      state => state.newLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        // omit from description
        const { focusType, focusDB, ..._description } = description;
        // brand new search
        const search = {};
        if (db === 'StructureInfo') {
          search.structureinfo = null;
        } else {
          _description.focusType = 'entry';
          _description.focusDB = db;
        }
        // build URL
        return `${protocol}//${hostname}:${port}${root}${description2path(
          _description,
        )}?${qsStringify(search)}`.replace(/\?$/, '');
      },
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
          coordinates: [obj[db][acc].coordinates.map(x => [x.start, x.end])],
        });
      }
    }
  }
  return out;
};

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const mergeData = (interpro, structures, structureInfo) => {
  const ipro = {};
  const out = interpro.reduce((acc, val) => {
    val.signatures = [];
    val.children = [];
    val.coordinates = toArrayStructure(val.entry_protein_locations);
    val.link = `/entry/${val.source_database}/${val.accession}`;
    ipro[val.accession] = val;
    if (!(val.entry_type in acc)) {
      acc[val.entry_type] = [];
    }
    acc[val.entry_type].push(val);
    return acc;
  }, {});
  if (structures.length > 0) {
    out.structures = structures
      .map(({ ...obj }) => ({
        label: `${obj.accession}: ${obj.chain}`,
        coordinates: toArrayStructure(obj.protein_structure_locations),
        link: `/structure/${obj.source_database}/${obj.accession}`,
        ...obj,
      }))
      .sort((a, b) => a.label > b.label);
  }
  if (structureInfo && structureInfo.prediction) {
    out.predictions = formatStructureInfoObj(structureInfo.prediction);
  }
  if (structureInfo && structureInfo.feature) {
    out.features = formatStructureInfoObj(structureInfo.feature);
  }
  return out;
};

class _StructureOnProtein extends Component {
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
    const mergedData = mergeData(
      dataInterPro.payload ? dataInterPro.payload.entries : [],
      structures,
      dataStructureInfo.payload,
    );
    return (
      <div>
        <DomainArchitecture protein={protein} data={mergedData} />
      </div>
    );
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
