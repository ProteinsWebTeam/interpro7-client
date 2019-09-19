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

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import protvista from 'components/Protvista/style.css';

import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

const f = foundationPartial(ipro, protvista);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

/* eslint-disable complexity  */
const processConservationData = (entry, match) => {
  const fragments = [];
  // applying run-length-encoding style compression

  let currentFragment;
  for (const residue of match) {
    let color;
    /* eslint-disable no-magic-numbers  */
    if (residue.score > 0.0 && residue.score <= 0.5) {
      color = '#ffffe0';
    } else if (residue.score > 0.5 && residue.score <= 1) {
      color = '#d3f4e0';
    } else if (residue.score > 1 && residue.score <= 1.5) {
      color = '#b9e5dd';
    } else if (residue.score > 1.5 && residue.score <= 2) {
      color = '#a5d5d8';
    } else if (residue.score > 2 && residue.score <= 2.5) {
      color = '#93c4d2';
    } else if (residue.score > 2.5 && residue.score <= 3) {
      color = '#82b3cd';
    } else if (residue.score > 3 && residue.score <= 3.5) {
      color = '#73a2c6';
    } else if (residue.score > 3.5 && residue.score <= 4) {
      color = '#6492c0';
    } else if (residue.score > 4 && residue.score <= 4.5) {
      color = '#5681b9';
    } else if (residue.score > 4.5 && residue.score <= 5) {
      color = '#4771b2';
    } else if (residue.score > 5 && residue.score <= 5.5) {
      color = '#3761ab';
    } else if (residue.score > 5.5 && residue.score <= 6) {
      color = '#2451a4';
    } else {
      color = '#00429d';
    }
    /* eslint-enable no-magic-numbers  */

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
  }
  if (currentFragment) fragments.push(currentFragment);
  return fragments;
};
/* eslint-enable complexity  */

const mergeConservationData = (data, conservationData) => {
  data.match_conservation = [];
  for (const db of Object.keys(conservationData)) {
    if (db.toLowerCase() !== 'sequence') {
      const dbConservationScores = {
        category: 'Sequence conservation',
        type: 'sequence_conservation',
        accession: db,
        locations: [],
      };
      const entries = conservationData[db].entries;
      for (const entry of Object.keys(entries)) {
        const matches = entries[entry];
        for (const match of matches) {
          const fragments = processConservationData(entry, match);
          dbConservationScores.locations.push({
            fragments: fragments,
            match: entry,
          });
        }
      }
      data.match_conservation.push(dbConservationScores);
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
  return Object.values(newFeatures);
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
}; */
export class DomainOnProteinWithoutMergedData extends PureComponent /*:: <Props> */ {
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
        id={mainData.metadata.accession || mainData.payload.metadata.accession}
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

  /* eslint-disable no-magic-numbers */
  static MAX_PROTEIN_LENGTH_FOR_HMMER = 5000;
  /* eslint-enable no-magic-numbers */

  constructor(props /*: Props */) {
    super(props);
    this.state = {
      generateConservationData: false,
      showConservationButton: false,
      dataConservation: null,
    };
  }

  fetchConservationData = () => {
    this.setState({ generateConservationData: true });
  };

  isConservationDataAvailable = data => {
    // check if conservation data has already been generated
    if (this.state.dataConservation) return false;

    // check protein length is less than HmmerWeb length limit
    if (data.domain.length > 0) {
      if (
        data.domain[0].protein_length >=
        DomainOnProteinWithoutData.MAX_PROTEIN_LENGTH_FOR_HMMER
      )
        return false;
    }
    if (data.unintegrated.length > 0) {
      if (
        data.unintegrated[0].protein_length >=
        DomainOnProteinWithoutData.MAX_PROTEIN_LENGTH_FOR_HMMER
      )
        return false;
    }

    // ensure there is a pfam entry somewhere in the matches
    for (const entry of data.domain) {
      for (const memberDatabase of Object.keys(entry.member_databases)) {
        if (memberDatabase.toLowerCase() === 'pfam') return true;
      }
    }
    for (const entry of data.unintegrated) {
      if (entry.source_database.toLowerCase() === 'pfam') return true;
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

    if (!data || data.loading) return <Loading />;
    if (!data.payload || !data.payload.results) {
      return <div className={f('callout')}>No entries match this protein.</div>;
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
        />
        {showConservationButton ? (
          <div className={f('track-container')}>
            <div className={f('track-row')}>
              <div className={f('track-component')}>
                <header>
                  <button onClick={this.fetchConservationData}>
                    ▸ Match Conservation
                  </button>
                </header>
              </div>
              <div className={f('track-accession')}>
                <button
                  type="button"
                  className={f('hollow', 'button', 'user-select-none')}
                  onClick={this.fetchConservationData}
                >
                  {' '}
                  Fetch data: {this.state.refresh}{' '}
                </button>
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
