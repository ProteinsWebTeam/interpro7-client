// @flow
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';
import Protvista from 'components/Protvista';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const getUrlFor = createSelector(
  // this one only to memoize it
  db => db,
  db =>
    createSelector(
      state => state.settings.api,
      state => state.customLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        const _description = {};
        for (const [key, value] of Object.entries(description)) {
          _description[key] = { ...value };
        }
        // omit detail from description
        _description[description.main.key].detail = null;
        // brand new search
        const search = {};
        if (db === 'Residues') {
          search.residues = null;
        } else {
          _description.entry.isFilter = true;
          _description.entry[db === 'InterPro' ? 'db' : 'integration'] = db;
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

const mergeResidues = residues =>
  Object.values(residues.entry_locations).map(location => ({
    accession: location.entry_accession,
    type: 'residue',
    coordinates: [location.fragments.map(f => [f.start, f.end])], // TODO: check
    name: location.fragments[0],
    entry: location.entry_accession,
    residue: location.fragments.map(f => f.residue),
    source_database: location.fragments.map(f => f.source)[0],
    interpro_entry: location.fragments.map(f => f.interProEntry),
  }));

// const mergeResidues = residues => {
// TODO: have Matloob check what it was supposed to be doing
//   for (const key of Object.keys(residues)) {
//     residues[key].reduce((acc, v) => {
//       if (!(v.description in acc)) {
//         acc[v.description] = [];
//       }
//       acc[v.description].push(v);
//       return acc;
//     }, out);
//   }
//   out = Object.keys(out).map(a => ({
//     accession: a,
//     type: 'residue',
//     coordinates: [out[a].map(b => [b.from, b.to])],
//     name: out[a].reduce((acc, v) => v.name),
//     entry: out[a].reduce((acc, v) => v.entry),
//     residue: out[a].map(b => b.residue),
//     source_database: out[a].map(b => b.source),
//     interpro_entry: out[a].map(b => b.interProEntry),
//   }));
//   return out;
// };

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const groupByEntryType = interpro => {
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
  return { out, ipro };
};

const addSignature = (entry, ipro, integrated) => {
  if (entry.entry_integrated in ipro) {
    entry.link = `/entry/${entry.source_database}/${entry.accession}`;
    ipro[entry.entry_integrated].signatures.push(entry);
    ipro[entry.entry_integrated].children.push(entry);
  } else if (entry in integrated) {
    console.error('integrated entry without InterPro: ', entry);
  }
};

const mergeData = (interpro, integrated, unintegrated, residues) => {
  const { out, ipro } = groupByEntryType(interpro);
  if (unintegrated.length > 0) {
    unintegrated.forEach(
      u => (u.link = `/entry/${u.source_database}/${u.accession}`),
    );
    out.unintegrated = unintegrated;
  }
  for (const entry of integrated.concat(unintegrated)) {
    entry.coordinates = toArrayStructure(entry.entry_protein_locations);
    if (residues.hasOwnProperty(entry.accession)) {
      entry.children = entry.residues = mergeResidues({
        [entry.accession]: residues[entry.accession],
      });
      delete residues[entry.accession];
    }
    addSignature(entry, ipro, integrated);
  }
  return out;
};

const UNDERSCORE = /_/g;
const sortFunction = ([a], [b]) => {
  const firsts = ['family', 'domain'];
  const lasts = ['residues', 'features', 'predictions'];
  for (const label of firsts) {
    if (a.toLowerCase() === label) return 0;
    if (b.toLowerCase() === label) return 1;
  }
  for (const l of lasts) {
    if (a.toLowerCase() === l) return 1;
    if (b.toLowerCase() === l) return 0;
  }
  return a > b ? 1 : 0;
};

export class DomainOnProteinWithoutMergedData extends PureComponent {
  static propTypes = {
    mainData: T.object.isRequired,
    dataMerged: T.object.isRequired,
  };

  render() {
    const { mainData, dataMerged } = this.props;
    const sortedData = Object.entries(dataMerged)
      .sort(sortFunction)
      // “Binding_site” -> “Binding site”
      .map(([key, value]) => [key.replace(UNDERSCORE, ' '), value]);

    return (
      <Protvista
        protein={mainData.metadata || mainData.payload.metadata}
        data={sortedData}
      />
    );
  }
}

export class DomainOnProteinWithoutData extends PureComponent {
  static propTypes = {
    mainData: T.object.isRequired,
    dataInterPro: T.object.isRequired,
    dataIntegrated: T.object.isRequired,
    dataUnintegrated: T.object.isRequired,
    dataResidues: T.object.isRequired,
    dataMerged: T.object,
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
      return <Loading />;
    }

    const mergedData = mergeData(
      'payload' in dataInterPro ? dataInterPro.payload.entries : [],
      'payload' in dataIntegrated ? dataIntegrated.payload.entries : [],
      'payload' in dataUnintegrated ? dataUnintegrated.payload.entries : [],
      dataResidues.payload,
    );

    if (Object.keys(mergedData).length === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          There is no available domain for this protein.
        </div>
      );
    }

    return (
      <DomainOnProteinWithoutMergedData
        mainData={mainData}
        dataMerged={mergedData}
      />
    );
  }
}

const DomainOnProtein = [
  'Integrated',
  'InterPro',
  'Residues',
  'Unintegrated',
].reduce(
  (Index, db) =>
    loadData({
      getUrl: getUrlFor(db),
      propNamespace: db,
    })(Index),
  DomainOnProteinWithoutData,
);

export default DomainOnProtein;
