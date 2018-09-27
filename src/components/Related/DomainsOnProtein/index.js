/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { processData } from 'components/ProtVista/utils';

import Loading from 'components/SimpleCommonComponents/Loading';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

const f = foundationPartial(ipro);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const mergeResidues = (data, residues) => {
  Object.values(data).forEach(group =>
    group.forEach(entry => {
      if (residues[entry.accession])
        entry.residues = [residues[entry.accession]];
      if (entry.children && entry.children.length)
        entry.children.forEach(child => {
          if (residues[child.accession])
            child.residues = [residues[child.accession]];
        });
    }),
  );
};
const orderByAccession = (a, b) => (a.accession > b.accession ? 1 : -1);
const groupByEntryType = interpro => {
  const groups = {};
  for (const entry of interpro) {
    if (!groups[entry.type]) groups[entry.type] = [];
    groups[entry.type].push(entry);
  }
  Object.values(groups).forEach(g => g.sort(orderByAccession));
  return groups;
};

const UNDERSCORE = /_/g;
const sortFunction = ([a], [b]) => {
  const firsts = ['family', 'domain'];
  const lasts = ['residues', 'features', 'predictions'];
  for (const label of firsts) {
    if (a.toLowerCase() === label) return -1;
    if (b.toLowerCase() === label) return 1;
  }
  for (const l of lasts) {
    if (a.toLowerCase() === l) return 1;
    if (b.toLowerCase() === l) return -1;
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
        title="Entry matches to this protein"
      />
    );
  }
}
export class DomainOnProteinWithoutData extends PureComponent {
  static propTypes = {
    mainData: T.object.isRequired,
    data: T.object.isRequired,
    dataResidues: T.object.isRequired,
  };

  render() {
    const { data, mainData, dataResidues } = this.props;

    if (!data || data.loading) return <Loading />;
    if (!data.payload || !data.payload.results) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          There are no entries matching this protein.
        </div>
      );
    }

    const { interpro, unintegrated } = processData({
      data,
      endpoint: 'protein',
    });
    const interproFamilies = interpro.filter(entry => entry.type === 'family');
    const groups = groupByEntryType(interpro);
    unintegrated.sort(orderByAccession);
    const mergedData = { ...groups, unintegrated };
    if (dataResidues && !dataResidues.loading && dataResidues.payload) {
      mergeResidues(mergedData, dataResidues.payload);
    }

    return (
      <>
        <div className={f('margin-bottom-large')}>
          <h5>Protein family membership</h5>
          {interproFamilies.length ? (
            <ProteinEntryHierarchy entries={interproFamilies} />
          ) : (
            <p className={f('margin-bottom-medium')}>None predicted</p>
          )}
        </div>

        <DomainOnProteinWithoutMergedData
          mainData={mainData}
          dataMerged={mergedData}
        />
      </>
    );
  }
}

const getInterproRelatedEntriesURL = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root }, accession) => {
    const newDesc = {
      main: { key: 'entry' },
      protein: { isFilter: true, db: 'uniprot', accession },
      entry: { db: 'all' },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        page_size: 200,
        extra_fields: 'hierarchy',
      },
    });
  },
);
const getResiduesURL = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        residues: null,
      },
    });
  },
);

export default loadData({ getUrl: getResiduesURL, propNamespace: 'Residues' })(
  loadData(getInterproRelatedEntriesURL)(DomainOnProteinWithoutData),
);
