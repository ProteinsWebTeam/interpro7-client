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
import pvista from 'components/ProtVista/style.css';
import spinner from 'components/SimpleCommonComponents/Loading/style.css';
import localCSS from './style.css';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

const f = foundationPartial(localCSS, ipro, pvista, spinner);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const colourMap = [
  {
    color: '#dff9e1',
    min: 0,
    max: 1,
  },
  {
    color: '#bce7dd',
    min: 1,
    max: 2,
  },
  {
    color: '#a2d2d7',
    min: 2,
    max: 3,
  },
  {
    color: '#8cbdd0',
    min: 3,
    max: 4,
  },
  {
    color: '#78a8c8',
    min: 4,
    max: 5,
  },
  {
    color: '#6593c0',
    min: 5,
    max: 6,
  },
  {
    color: '#537eb8',
    min: 6,
    max: 7,
  },
  {
    color: '#4069af',
    min: 7,
    max: 8,
  },
  {
    color: '#2955a6',
    min: 8,
    max: 9,
  },
  {
    color: '#00429d',
    min: 9,
    max: 10,
  },
];

const processConservationData = (entry, match) => {
  const fragments = [];
  // applying run-length-encoding style compression

  let currentFragment;
  for (const residue of match) {
    let hit;
    // handle out-of-range values
    if (residue.score < colourMap[0].min) {
      // score < 0 = 0. Insertion
      hit = colourMap[0];
    } else if (residue.score > colourMap[colourMap.length - 1].max) {
      // score > 10 = 10. Shouldn't happen as it's a probability * 10
      hit = colourMap[colourMap.length - 1];
    } else {
      hit = colourMap.find(element => {
        return residue.score > element.min && residue.score <= element.max;
      });
    }

    if (hit) {
      const color = hit.color;
      if (!currentFragment) {
        currentFragment = {
          start: residue.position,
          end: residue.position,
          color: color,
        };
      }
      currentFragment.end = residue.position - 1;
      if (color !== currentFragment.color) {
        fragments.push(currentFragment);
        currentFragment = {
          start: residue.position,
          end: residue.position,
          color: color,
        };
      }
    } else {
      console.log(`Failed to find score ${residue.score}`);
    }
  }
  if (currentFragment) fragments.push(currentFragment);
  return fragments;
};

const addExistingEntiesToConservationResults = (
  data,
  conservationDatabases,
) => {
  /* eslint-disable max-depth */
  for (const matches of [data.domain, data.family]) {
    if (matches) {
      for (const entry of matches) {
        for (const child of entry.children) {
          if (conservationDatabases.includes(child.source_database)) {
            data.match_conservation.push(child);
          }
        }
      }
    }
  }
  /* eslint-enable max-depth */

  for (const entry of data.unintegrated) {
    if (entry && conservationDatabases.includes(entry.source_database)) {
      data.match_conservation.push(entry);
    }
  }
};

const mergeConservationData = (data, conservationData) => {
  data.match_conservation = [];
  const conservationDatabases = [];
  for (const db of Object.keys(conservationData)) {
    if (db.toLowerCase() !== 'sequence') {
      conservationDatabases.push(db);
      const dbConservationScores = {
        category: 'Sequence conservation',
        type: 'sequence_conservation',
        accession: db,
        locations: [],
        range: colourMap,
      };
      const entries = conservationData[db].entries;
      /* eslint-disable max-depth */
      if (entries) {
        for (const entry of Object.keys(entries)) {
          const matches = entries[entry];
          // eslint-disable-next-line max-depth
          for (const match of matches) {
            const fragments = processConservationData(entry, match);
            dbConservationScores.locations.push({
              fragments: fragments,
              match: entry,
            });
          }
        }
        /* eslint-enable max-depth */
        data.match_conservation.push(dbConservationScores);
        // add data from integrated and unintegrated matches to panel for ease of use
        addExistingEntiesToConservationResults(data, conservationDatabases);
      }
    }
  }
};

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

const splitMobiFeatures = feature => {
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
    Object.values(extraFeatures).filter(
      ({ source_database: db }) => db !== 'mobidblt',
    ),
  );

  return data;
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

const getExtraURL = query =>
  createSelector(
    state => state.settings.api,
    state => state.customLocation.description,
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
  dataMerged: Object
  handleToggle?: function,
}; */
export class DomainOnProteinWithoutMergedData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    dataMerged: T.object.isRequired,
    handleToggle: T.func,
  };

  render() {
    const { mainData, dataMerged, handleToggle } = this.props;
    const sortedData = Object.entries(dataMerged)
      .sort(sortFunction)
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
        handleToggle={handleToggle}
      />
    );
  }
}

const ConservationProvider = ({ handleLoaded, dataConservation }) => {
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

const ConservationProviderLoaded = loadData({
  getUrl: getExtraURL('conservation'),
  propNamespace: 'Conservation',
})(ConservationProvider);

/*:: type DPWithoutDataProps = {
  mainData: Object,
  data: Object,
  dataResidues: Object,
  dataFeatures: Object,
  dataGenome3d: Object
}; */

export class DomainOnProteinWithoutData extends PureComponent /*:: <DPWithoutDataProps> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    data: T.object.isRequired,
    dataResidues: T.object.isRequired,
    dataFeatures: T.object.isRequired,
    dataGenome3d: T.object.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);
    this.state = {
      generateConservationData: false,
      showConservationButton: false,
      dataConservation: null,
      addLabelClass: '',
    };
  }
  // eslint-disable-next-line no-magic-numbers
  static MAX_PROTEIN_LENGTH_FOR_HMMER = 5000;

  fetchConservationData = () => {
    this.setState({ generateConservationData: true });
  };

  isConservationDataAvailable = data => {
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

    // ensure there is a pfam entry somewhere in the matches
    /* eslint-disable max-depth */
    for (const matches of [data.domain, data.family]) {
      if (matches) {
        for (const entry of matches) {
          for (const memberDatabase of Object.keys(entry.member_databases)) {
            if (memberDatabase.toLowerCase() === 'pfam') return true;
          }
        }
      }
    }
    /* eslint-enable max-depth */
    for (const entry of data.unintegrated) {
      if (entry.source_database.toLowerCase() === 'pfam') return true;
    }

    return false;
  };

  // To adjust the Conservation track in ProtVista width when label by name/accession is switched
  _handleToggleLabel = isAccession => {
    isAccession
      ? this.setState({ addLabelClass: 'label-by-name' })
      : this.setState({ addLabelClass: '' });
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

    if (!data || data.loading) return <Loading />;
    if (!data.payload || !data.payload.results) {
      const edgeCaseText = edgeCases.get(STATUS_TIMEOUT);
      return data.payload?.detail === 'Query timed out' ? (
        <EdgeCase text={edgeCaseText} status={STATUS_TIMEOUT} />
      ) : (
        <div className={f('callout')}>No entries match this protein.</div>
      );
    }

    const { interpro, unintegrated, other } = processData({
      data,
      endpoint: 'protein',
    });
    const interproFamilies = interpro.filter(entry => entry.type === 'family');
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

    const showConservationButton = this.isConservationDataAvailable(mergedData);
    const ConservationProviderElement = this.state.generateConservationData
      ? ConservationProviderLoaded
      : ConservationProvider;

    return (
      <>
        <ConservationProviderElement
          handleLoaded={data => this.setState({ dataConservation: data })}
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
          handleToggle={this._handleToggleLabel}
        />
        {showConservationButton ? (
          <div className={f('protvista', 'tracks-container')}>
            <div className={f('track-container', 'conservation-placeholder')}>
              <div className={f('track-row')}>
                <div className={f('track-component', this.state.addLabelClass)}>
                  <header>
                    <button onClick={this.fetchConservationData}>
                      ▸ Match Conservation
                    </button>
                  </header>
                </div>
              </div>
              <div className={f('track-group')}>
                <div className={f('track-row')}>
                  <div
                    className={f(
                      'track-component',
                      'conservation-placeholder-component',
                      this.state.addLabelClass,
                    )}
                  >
                    {this.state.generateConservationData ? (
                      <div
                        className={f('loading-spinner')}
                        style={{ margin: '10px auto' }}
                      >
                        <div />
                        <div />
                        <div />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  {this.state.generateConservationData ? (
                    ''
                  ) : (
                    <div
                      className={f('track-accession', this.state.addLabelClass)}
                    >
                      <button
                        type="button"
                        className={f('hollow', 'button', 'user-select-none')}
                        onClick={this.fetchConservationData}
                      >
                        Fetch Conservation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}
/* eslint-enable complexity  */

const getRelatedEntriesURL = createSelector(
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

const getGenome3dURL = createSelector(
  state => state.settings.genome3d,
  state => state.customLocation.description.protein.accession,
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
