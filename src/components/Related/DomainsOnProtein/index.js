// @flow
/* eslint-disable no-param-reassign */
import React, { PureComponent, useEffect } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { processData } from 'components/ProtVista/utils';

import { formatGenome3dIntoProtVistaPanels } from 'components/Genome3D';

import Loading from 'components/SimpleCommonComponents/Loading';
import { edgeCases, STATUS_TIMEOUT } from 'utils/server-message';
import EdgeCase from 'components/EdgeCase';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

const f = foundationPartial(ipro);

const CONSERVATION_WINDOW = 25;
const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const processConservationData = (entry, match) => {
  const halfWindow = Math.trunc(CONSERVATION_WINDOW / 2);
  const scores = [];

  let window = [];
  for (let i = 0; i < match.length; i++) {
    if (i < halfWindow) {
      // First half of first window [0-11] -> window length varies from 13 to 24
      window = match.slice(0, i + halfWindow + 1);
    } else if (i >= halfWindow && i < match.length - halfWindow) {
      // Rest takes fixed length of 25. [-12--element--12]
      window = match.slice(i - halfWindow, i + halfWindow + 1);
    } else {
      // Last half of last window [seqLength-12 to seqLength] -> window length varies from 24 to 13
      window = match.slice(i - halfWindow, match.length);
    }
    scores.push({
      ...match[i],
      value: (
        window.reduce((acc, residue) => {
          let score = residue.score;
          if (score < 0)
            // In case of negative score, treat it as 0
            score = 0;
          return acc + score;
        }, 0) / window.length
      ).toFixed(2),
    });
  }
  return scores;
};

const addExistingEntryToConservationResults = (
  data /*: {[string]: Array<Object>} */,
  conservationDatabases /*: Array<string> */,
  entryWithMostCoverage /*: string */,
) => {
  /* eslint-disable max-depth */
  for (const matches of [data.domain, data.family, data.repeat]) {
    if (matches) {
      for (const entry of matches) {
        for (const child of entry.children) {
          if (
            conservationDatabases.includes(child.source_database) &&
            child.accession === entryWithMostCoverage
          ) {
            data.match_conservation.push(child);
          }
        }
      }
    }
  }
  /* eslint-enable max-depth */

  for (const entry of data.unintegrated) {
    if (
      entry &&
      conservationDatabases.includes(entry.source_database) &&
      entry.accession === entryWithMostCoverage
    ) {
      data.match_conservation.push(entry);
    }
  }
};

// eslint-disable-next-line max-statements
const mergeConservationData = (
  data /*: {[string]: Array<Object>} */,
  conservationData /*: { [string]: {entries: ?{}, warnings: Array<string>}} */,
) => {
  data.match_conservation = [];
  const conservationDatabases = [];
  let entryWithMostCoverage = '';
  for (const db of Object.keys(conservationData)) {
    if (db.toLowerCase() !== 'sequence') {
      conservationDatabases.push(db);
      const dbConservationScores = {
        category: 'Sequence conservation',
        type: 'sequence_conservation',
        accession: db,
        data: [],
        warnings: [],
      };
      const entries = conservationData[db].entries;
      /* eslint-disable max-depth */
      if (entries) {
        let coverage = 0;
        // Add only the entry match that covers the most (longest)
        for (const entry of Object.keys(entries)) {
          const matches = entries[entry];
          const length = matches.reduce((sum, array) => sum + array.length, 0);
          if (length > coverage) {
            coverage = length;
            entryWithMostCoverage = entry;
          }
        }

        for (const entry of Object.keys(entries)) {
          if (entry === entryWithMostCoverage) {
            const values = [];
            let end = 0;
            for (const match of entries[entry]) {
              if (values.length === 0) {
                end = match[match.length - 1].position;
              } else {
                // Fill with empty values to render gaps in between in the line graph
                if (match[0].position - end > 1) {
                  for (let i = end; i < match[0].position; i++) {
                    const nextPosition = i + 1;
                    values.push({ position: nextPosition, value: null });
                  }
                }
              }
              const conservationAverage = processConservationData(entry, match);
              values.push(...conservationAverage);
            }
            dbConservationScores.data.push({
              name: entry,
              range: [0, 2],
              colour: '#006400',
              values: values,
            });
          }
        }
        const warnings = conservationData[db].warnings;
        if (warnings) {
          dbConservationScores.warnings = warnings;
        }
        data.match_conservation?.push(dbConservationScores);

        // add data from integrated and unintegrated matches to panel for ease of use
        addExistingEntryToConservationResults(
          data,
          conservationDatabases,
          entryWithMostCoverage,
        );
      }
    }
  }
};

const mergeResidues = (data, residues) => {
  // prettier-ignore
  (Object.values(data)/*: any */).forEach(
    (group/*: Array<{accession:string, residues: Array<Object>, children: any}> */) =>
    group.forEach((entry) => {
      if (residues[entry.accession])
        entry.residues = [residues[entry.accession]];
      if (entry.children && entry.children.length)
        entry.children.forEach((child) => {
          if (residues[child.accession])
            child.residues = [residues[child.accession]];
        });
    }),
  );
};

const splitMobiFeatures = (feature) => {
  const newFeatures = {};
  for (const loc of feature.locations) {
    const key =
      (loc.fragments[0] && loc.fragments[0].seq_feature) ||
      loc.seq_feature ||
      'Consensus Disorder Prediction';
    if (key in newFeatures) {
      newFeatures[key].locations.push(loc);
    } else {
      newFeatures[key] = {
        ...feature,
        accession: `Mobidblt-${key}`,
        locations: [loc],
      };
    }
  }

  const sortedObj = Object.keys(newFeatures)
    .sort((a, b) => {
      return a === 'Consensus Disorder Prediction' &&
        b !== 'Consensus Disorder Prediction'
        ? -1
        : 1;
    })
    .reduce((acc, key) => {
      acc[key] = newFeatures[key];
      return acc;
    }, {});
  return Object.values(sortedObj);
};

const mergeExtraFeatures = (data, extraFeatures) => {
  if ('mobidb-lite' in extraFeatures) {
    data.other_features = data.other_features.concat(
      splitMobiFeatures(extraFeatures['mobidb-lite']),
    );
  }
  data.other_features = data.other_features.concat(
    // prettier-ignore
    (Object.values(extraFeatures)/*: any */).filter(
      ({ source_database: db }) => db !== 'mobidblt',
    ),
  );

  return data;
};

const orderByAccession = (a, b) => (a.accession > b.accession ? 1 : -1);
export const groupByEntryType = (interpro) => {
  const groups = {};
  for (const entry of interpro) {
    if (!groups[entry.type]) groups[entry.type] = [];
    groups[entry.type].push(entry);
  }
  // prettier-ignore
  (Object.values(groups) /*: any */)
    .forEach((g) => g.sort(orderByAccession));
  return groups;
};

const UNDERSCORE = /_/g;
export const byEntryType = ([a], [b]) => {
  const firsts = [
    'family',
    'domain',
    'homologous_superfamily',
    'repeat',
    'conserved_site',
    'active_site',
    'binding_site',
    'ptm',
    'unintegrated',
  ];
  const lasts = ['residues', 'features', 'predictions', 'match_conservation'];
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

const getExtraURL = (query /*: string */) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description,
    ({ protocol, hostname, port, root }, description) => {
      const url = format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(description),
        query: {
          [query]: null,
        },
      });
      return url;
    },
  );

/*:: type Props = {
  mainData: Object,
  dataMerged: Object,
  showConservationButton?: boolean,
  handleConservationLoad?: function,
  children: any,
}; */
export class DomainOnProteinWithoutMergedData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    dataMerged: T.object.isRequired,
    showConservationButton: T.bool,
    handleConservationLoad: T.func,
    children: T.any,
  };

  render() {
    const {
      mainData,
      dataMerged,
      showConservationButton,
      handleConservationLoad,
    } = this.props;
    const sortedData = Object.entries(dataMerged)
      .sort(byEntryType)
      // “Binding_site” -> “Binding site”
      .map(([key, value]) => [
        key === 'ptm' ? 'PTM' : key.replace(UNDERSCORE, ' '),
        value,
      ]);

    return (
      <ProtVista
        protein={mainData.metadata || mainData.payload.metadata}
        data={sortedData}
        title="Entry matches to this protein"
        id={mainData.metadata.accession || mainData.payload.metadata.accession}
        showConservationButton={showConservationButton}
        handleConservationLoad={handleConservationLoad}
      >
        {this.props.children}
      </ProtVista>
    );
  }
}

const ConservationProvider = (
  {
    handleLoaded,
    dataConservation,
  } /*: { handleLoaded: function, dataConservation?: { loading: boolean, payload: {}} } */,
) => {
  useEffect(() => {
    if (
      dataConservation &&
      !dataConservation.loading &&
      dataConservation.payload
    ) {
      handleLoaded(dataConservation.payload);
    }
  });
  return null;
};
ConservationProvider.propTypes = {
  handleLoaded: T.func,
  dataConservation: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
};

const getConservationURL = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const url = format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        conservation: 'panther',
      },
    });
    return url;
  },
);

const ConservationProviderLoaded = loadData({
  getUrl: getConservationURL,
  propNamespace: 'Conservation',
})(ConservationProvider);

/*::
type DPWithoutDataProps = {
  mainData: Object,
  data: Object,
  dataResidues: Object,
  dataFeatures: Object,
  dataGenome3d: Object,
  children: mixed,
};
type DPState ={
  generateConservationData: boolean,
  showConservationButton: boolean,
  dataConservation: ?{ [string]: {entries: ?{}, warnings: Array<string>}},
}
*/

export class DomainOnProteinWithoutData extends PureComponent /*:: <DPWithoutDataProps, DPState> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    data: T.object.isRequired,
    dataResidues: T.object.isRequired,
    dataFeatures: T.object.isRequired,
    dataGenome3d: T.object.isRequired,
    children: T.any,
  };

  constructor(props /*: DPWithoutDataProps */) {
    super(props);
    this.state = {
      generateConservationData: false,
      showConservationButton: false,
      dataConservation: null,
    };
  }
  // eslint-disable-next-line no-magic-numbers
  static MAX_PROTEIN_LENGTH_FOR_HMMER = 5000;

  fetchConservationData = () => {
    this.setState({ generateConservationData: true });
  };

  isConservationDataAvailable = (data, proteinData) => {
    // HMMER can't generate conservation data for unreviewed proteins
    if (proteinData.source_database === 'unreviewed') return false;

    // check if conservation data has already been generated
    if (this.state.dataConservation) return false;

    // check protein length is less than HmmerWeb length limit
    if (data.domain && data.domain.length > 0) {
      if (
        data.domain[0].protein_length >=
        DomainOnProteinWithoutData.MAX_PROTEIN_LENGTH_FOR_HMMER
      )
        return false;
    }
    if (data.unintegrated && data.unintegrated.length > 0) {
      if (
        data.unintegrated[0].protein_length >=
        DomainOnProteinWithoutData.MAX_PROTEIN_LENGTH_FOR_HMMER
      )
        return false;
    }

    // ensure there is a panther entry somewhere in the matches
    /* eslint-disable max-depth */
    for (const matches of [data.domain, data.family, data.repeat]) {
      if (matches) {
        for (const entry of matches) {
          for (const memberDatabase of Object.keys(entry.member_databases)) {
            if (memberDatabase.toLowerCase() === 'panther') return true;
          }
        }
      }
    }
    /* eslint-enable max-depth */
    for (const entry of data.unintegrated) {
      if (entry.source_database.toLowerCase() === 'panther') return true;
    }

    return false;
  };

  /* eslint-disable complexity  */
  render() {
    const {
      data,
      mainData,
      dataResidues,
      dataFeatures,
      dataGenome3d,
    } = this.props;

    if (
      (!data || data.loading) &&
      (!dataFeatures || dataFeatures.loading || !dataFeatures.payload)
    )
      return <Loading />;
    if (!data.payload || !data.payload.results) {
      const edgeCaseText = edgeCases.get(STATUS_TIMEOUT);
      if (data.payload?.detail === 'Query timed out')
        return <EdgeCase text={edgeCaseText} status={STATUS_TIMEOUT} />;
    }

    const { interpro, unintegrated, other } = processData({
      data: data?.payload?.results ? data : { payload: { results: [] } },
      endpoint: 'protein',
    });
    const interproFamilies = interpro.filter(
      (entry) => entry.type === 'family',
    );
    const groups = groupByEntryType(interpro);
    const genome3d = formatGenome3dIntoProtVistaPanels(dataGenome3d);
    unintegrated.sort(orderByAccession);
    const mergedData = {
      ...groups,
      unintegrated,
      other_features: other,
      ...genome3d,
    };

    if (dataResidues && !dataResidues.loading && dataResidues.payload) {
      mergeResidues(mergedData, dataResidues.payload);
    }
    if (dataFeatures && !dataFeatures.loading && dataFeatures.payload) {
      mergeExtraFeatures(mergedData, dataFeatures.payload);
    }
    if (!mergedData.other_features || !mergedData.other_features.length) {
      delete mergedData.other_features;
    }
    if (this.state.dataConservation) {
      mergeConservationData(mergedData, this.state.dataConservation);
    }

    if (
      !Object.keys(mergedData).length ||
      // prettier-ignore
      !(Object.values(mergedData)/*: any */)
        .map((x/*: Array<Object> */) => x.length)
        .reduce((agg, v) => agg + v, 0)
    ) {
      return <div className={f('callout')}>No entries match this protein.</div>;
    }
    const showConservationButton = this.isConservationDataAvailable(
      mergedData,
      mainData.metadata,
    );
    const ConservationProviderElement = this.state.generateConservationData
      ? ConservationProviderLoaded
      : ConservationProvider;

    return (
      <>
        <ConservationProviderElement
          handleLoaded={(data) => this.setState({ dataConservation: data })}
        />
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
          showConservationButton={showConservationButton}
          handleConservationLoad={this.fetchConservationData}
        >
          {this.props.children}
        </DomainOnProteinWithoutMergedData>
      </>
    );
  }
}
/* eslint-enable complexity  */

const getRelatedEntriesURL = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.protein.accession,
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

const getGenome3dURL = createSelector(
  (state) => state.settings.genome3d,
  (state) => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}uniprot/${accession}`,
      query: {
        protvista: true,
      },
    });
  },
);

export default loadData({
  getUrl: getExtraURL('extra_features'),
  propNamespace: 'Features',
})(
  loadData({ getUrl: getExtraURL('residues'), propNamespace: 'Residues' })(
    loadData({ getUrl: getGenome3dURL, propNamespace: 'Genome3d' })(
      loadData(getRelatedEntriesURL)(DomainOnProteinWithoutData),
    ),
  ),
);
