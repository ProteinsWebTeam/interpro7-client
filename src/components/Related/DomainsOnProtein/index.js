/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

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

// const mergeResidues = residues =>
//   Object.values(residues).map(location => ({
//     accession: `_${location.entry_accession}`,
//     name: location.name,
//     type: 'residue',
//     location2residue: location.fragments.reduce((acc, fragment) => {
//       acc[fragment.start] = fragment.residue;
//       return acc;
//     }, {}),
//     source_database: location.source,
//     locations: location.fragments.map(f => ({
//       fragments: [{ start: f.start, end: f.end }],
//     })),
//   }));

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

// const groupResidues = residues => {
//   TODO: Check if this is necessary for the cases that a residue is related to an unexistent entry
//   TODO: Remove this when using the full dataset
//   const resTypes = {};
//   for (const fr of residues.fragments || residues.locations) {
//     if (!(fr.description in resTypes)) resTypes[fr.description] = [];
//     resTypes[fr.description].push(fr);
//   }
//   const output = [
//     {
//       accession: residues.name,
//       entry_accession: residues.entry_accession,
//       locations: Object.entries(resTypes).map(([description, fragments]) => ({
//         accession: description.replace(' ', '_'),
//         description,
//         fragments,
//       })),
//     },
//   ];
//   return output;
// };
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
    if (residues && residues.hasOwnProperty(entry.accession)) {
      entry.residues = [residues[entry.accession]]; // groupResidues(residues[entry.accession]);
      delete residues[entry.accession];
    }
    addSignature(entry, ipro, integrated);
  }
  if (Object.keys(residues).length > 0) {
    out.residues = [residues]; //groupResidues(residues);
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
      <ProtVista
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
