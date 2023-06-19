// @flow
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
  // $FlowFixMe
} from 'components/AlphaFold/selectors';
// $FlowFixMe
import { processData } from 'components/ProteinViewer/utils';

import { formatGenome3dIntoProtVistaPanels } from 'components/Genome3D';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProtVistaForAlphaFold';

import Loading from 'components/SimpleCommonComponents/Loading';
import { edgeCases, STATUS_TIMEOUT } from 'utils/server-message';
import EdgeCase from 'components/EdgeCase';

import ConservationProviderLoaded, {
  ConservationProvider,
  mergeConservationData,
  // $FlowFixMe
} from './ConservationProvider';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const PIRSR_ACCESSION_LENGTH = 11;
const PIRSF_PREFIX_LENGTH = 5;
const HTTP_OK = 200;

const ProteinViewer = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
});

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

/**
 * PIRSR residues associated with the same family can come from several models
 * which accession correspond to the family followed by the model. e.g. PIRSR000001-1 and PIRSR000001-2
 * This function groups those two model into a single residue with multiple locations.
 * @param {object} residues list of residues
 * @returns {object} list of residues with the PIRSR ones grouped
 */
const mergePIRSFRResidues = (
  residues /*: {[string]: any} */,
) /*: {[string]: any} */ => {
  const newResidues = {};
  Object.keys(residues).forEach((acc) => {
    if (acc.startsWith('PIRSR')) {
      const newAcc = acc.substring(0, PIRSR_ACCESSION_LENGTH);

      if (!newResidues[newAcc]) {
        newResidues[newAcc] = {
          ...residues[acc],
          accession: newAcc,
          locations: [],
        };
      }
      residues[acc].locations.forEach((location) => (location.accession = acc));
      newResidues[newAcc].locations.push(...residues[acc].locations);
    } else {
      newResidues[acc] = { ...residues[acc] };
    }
  });
  return newResidues;
};

const orderByAccession = (
  a /*: {accession: string} */,
  b /*: {accession: string} */,
) => (a.accession > b.accession ? 1 : -1);

const mergeResidues = (data, residuesPayload) => {
  const residuesWithEntryDetails = [];
  const residues = mergePIRSFRResidues(residuesPayload);

  // prettier-ignore
  (Object.values(data)/*: any */).forEach(
    (group/*: Array<{accession:string, residues: Array<Object>, children: any}> */) =>
      group.forEach((entry) => {
        const resAccession = entry.accession.startsWith('PIRSF')
          ? `PIRSR${entry.accession.substring(PIRSF_PREFIX_LENGTH, PIRSR_ACCESSION_LENGTH)}`
          : entry.accession;
        if (residues[resAccession]) {
          const matchedEntry = { ...entry };
          matchedEntry.accession = `residue:${entry.accession}`;
          matchedEntry.residues = [residues[resAccession]];
          residuesWithEntryDetails.push(matchedEntry);
          residues[resAccession].linked = true;
        }

        if (entry.children && entry.children.length)
          entry.children.forEach((child) => {
            const childResAccession = child.accession.startsWith('PIRSF')
              ? `PIRSR${child.accession.substring(PIRSF_PREFIX_LENGTH, PIRSR_ACCESSION_LENGTH)}`
              : child.accession;
            if (residues[childResAccession]) {
              const matchedEntry = { ...child };
              matchedEntry.accession = `residue:${child.accession}`;
              matchedEntry.residues = [residues[childResAccession]];
              residuesWithEntryDetails.push(matchedEntry);
              residues[childResAccession].linked = true;
            }
          });
      }),
  );

  const unlinkedResidues = [];

  // prettier-ignore
  (Object.values(residues)/*: any */)
    .filter(({ linked }/*: {linked?: boolean} */) => !linked)
    .forEach((residue) => {
      residue.locations.forEach((location, i) => {
        const residueEntry = { ...residue };
        residueEntry.accession = `${location.accession || residue.accession}.${i}`;
        residueEntry.type = 'residue';
        residueEntry.locations = [location];
        unlinkedResidues.push(residueEntry);
      });
    });
  unlinkedResidues.sort(orderByAccession);

  data.residues = residuesWithEntryDetails;
  data.other_residues = unlinkedResidues;
};

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
  const lasts = [
    'other_residues',
    'residues',
    'features',
    'predictions',
    'match_conservation',
  ];
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
  dataConfidence?: Object,
  conservationError?: string|null,
  showConservationButton?: boolean,
  handleConservationLoad?: function,
  children: any,
}; */
export class DomainOnProteinWithoutMergedData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    dataMerged: T.object.isRequired,
    dataConfidence: T.object,
    conservationError: T.string,
    showConservationButton: T.bool,
    handleConservationLoad: T.func,
    children: T.any,
  };

  render() {
    const {
      mainData,
      dataMerged,
      dataConfidence,
      conservationError,
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
    const protein = mainData.metadata || mainData.payload.metadata;
    addConfidenceTrack(dataConfidence, protein.accession, sortedData);

    return (
      <>
        <ProteinViewer
          protein={protein}
          data={sortedData}
          title="Entry matches to this protein"
          showConservationButton={showConservationButton}
          handleConservationLoad={handleConservationLoad}
          conservationError={conservationError}
        >
          {' '}
          {this.props.children}
        </ProteinViewer>
      </>
    );
  }
}

/*::
type DPWithoutDataProps = {
  mainData: Object,
  data: Object,
  dataResidues: Object,
  dataFeatures: Object,
  dataGenome3d: Object,
  dataConfidence: Object,
  children: mixed,
  onMatchesLoaded?: function,
};
type DPState ={
  generateConservationData: boolean,
  showConservationButton: boolean,
  dataConservation: ?{ [string]: {entries: ?{}, warnings: Array<string>}},
  errorConservation: null | string;
}
*/

export class DomainOnProteinWithoutData extends PureComponent /*:: <DPWithoutDataProps, DPState> */ {
  static propTypes = {
    mainData: T.object.isRequired,
    data: T.object.isRequired,
    dataResidues: T.object.isRequired,
    dataFeatures: T.object.isRequired,
    dataGenome3d: T.object.isRequired,
    dataConfidence: T.object.isRequired,
    children: T.any,
    onMatchesLoaded: T.func,
  };

  constructor(props /*: DPWithoutDataProps */) {
    super(props);
    this.state = {
      generateConservationData: false,
      showConservationButton: false,
      dataConservation: null,
      errorConservation: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.data !== this.props.data &&
      !this.props.data.loading &&
      this.props.onMatchesLoaded
    ) {
      this.props.onMatchesLoaded(this.props.data?.payload?.results);
    }
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
      dataConfidence,
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
          handleLoaded={(data) =>
            this.setState({
              dataConservation: data,
              errorConservation: null,
            })
          }
          handleError={(payload) => {
            let message = 'Unknown issue fetching the data.';
            if (payload.status) {
              message =
                payload.status === HTTP_OK
                  ? 'The server responded OK, however the payload is empty'
                  : `Server code - ${payload.status}`;
            }
            this.setState({
              dataConservation: null,
              errorConservation: `ERROR: ${message}`,
            });
          }}
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
          dataConfidence={dataConfidence}
          conservationError={this.state.errorConservation}
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
        extra_fields: 'hierarchy,short_name',
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
  getUrl: getAlphaFoldPredictionURL,
  propNamespace: 'Prediction',
})(
  loadData({
    getUrl: getConfidenceURLFromPayload('Prediction'),
    propNamespace: 'Confidence',
  })(
    loadData({
      getUrl: getExtraURL('extra_features'),
      propNamespace: 'Features',
    })(
      loadData({ getUrl: getExtraURL('residues'), propNamespace: 'Residues' })(
        loadData({ getUrl: getGenome3dURL, propNamespace: 'Genome3d' })(
          loadData(getRelatedEntriesURL)(DomainOnProteinWithoutData),
        ),
      ),
    ),
  ),
);
