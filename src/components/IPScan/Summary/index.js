import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flattenDeep } from 'lodash-es';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import getFetch from 'higherOrder/loadData/getFetch';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Redirect from 'components/generic/Redirect';
import Loading from 'components/SimpleCommonComponents/Loading';

import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';
import { DomainOnProteinWithoutMergedData } from 'components/Related/DomainsOnProtein';
import Actions from 'components/IPScan/Actions';
import { getIProScanURL } from 'components/IPScan/Status';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';

import { Exporter } from 'components/Table';
import { NOT_MEMBER_DBS } from 'menuConfig';
import { iproscan2urlDB } from 'utils/url-patterns';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import Link from 'components/generic/Link';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';
import style from './style.css';
import { updateJobTitle } from '../../../actions/creators';

const f = foundationPartial(ebiGlobalStyles, fonts, style);

const fetchFun = getFetch({ method: 'GET', responseType: 'JSON' });

/*:: type Props = {
  accession: string,
  localID: string,
  remoteID?: string,
  status: string,
  localTitle: string,
  data: {
    loading: boolean,
    payload: {
      results: Array<Object>,
    },
  },
  localPayload: ?Object,
}; */

const mergeMatch = (match1, match2) => {
  if (!match1) return match2;
  match1.locations = match1.locations.concat(match2.locations);
  return match1;
};

const getGoTerms = (matches) => {
  const goTerms = new Map();
  for (const match of matches) {
    for (const { id, category, name } of (match.signature.entry || {})
      .goXRefs || []) {
      goTerms.set(id, {
        category: {
          name: category.toLowerCase(),
          code: category[0],
        },
        name,
        identifier: id,
      });
    }
  }
  return goTerms;
};
const integrateSignature = (signature, interpro, integrated) => {
  const accession = interpro.accession;
  const entry = integrated.get(accession) || {
    accession,
    name: interpro.name,
    source_database: 'InterPro',
    _children: {},
    children: [],
    type: interpro.type.toLowerCase(),
  };
  entry._children[signature.accession] = signature;
  entry.children = Object.values(entry._children);
  integrated.set(accession, entry);
};

const StatusTooltip = React.memo(({ status } /*: string */) => (
  <Tooltip title={`Job ${status}`}>
    {(status === 'running' ||
      status === 'created' ||
      status === 'importing' ||
      status === 'submitted') && (
      <>
        <SpinningCircle />
        <div className={f('status')}>Searching</div>
      </>
    )}

    {status === 'not found' || status === 'failure' || status === 'error' ? (
      <>
        <span
          className={f('icon', 'icon-common', 'ico-notfound')}
          data-icon="&#x78;"
          aria-label="Job failed or not found"
        />{' '}
        {status}
      </>
    ) : null}
    {status === 'finished' && (
      <>
        <span
          className={f('icon', 'icon-common', 'ico-confirmed')}
          data-icon="&#xf00c;"
          aria-label="Job finished"
        />{' '}
        {status}
      </>
    )}
  </Tooltip>
));
StatusTooltip.displayName = 'StatusTooltip';
StatusTooltip.propTypes = {
  status: T.oneOf([
    'running',
    'created',
    'importing',
    'submitted',
    'not found',
    'failure',
    'error',
    'finished',
  ]),
};

const mergeData = (matches, sequenceLength) => {
  const mergedData = { unintegrated: {}, predictions: [] };
  let integrated = new Map();
  const signatures = new Map();
  for (const match of matches) {
    const { library } = match.signature.signatureLibraryRelease;
    const processedMatch = {
      accession: match.signature.accession,
      name: match.signature.name,
      source_database: iproscan2urlDB(library),
      protein_length: sequenceLength,
      locations: match.locations.map((loc) => ({
        ...loc,
        model_acc: match['model-ac'],
        fragments:
          loc['location-fragments'] && loc['location-fragments'].length
            ? loc['location-fragments']
            : [{ start: loc.start, end: loc.end }],
      })),
      score: match.score,
    };
    const residues = match.locations
      .map(({ sites }) =>
        sites
          ? {
              accession: match.signature.accession,
              locations: sites.map((site) => ({
                description: site.description,
                fragments: site.siteLocations,
              })),
            }
          : null,
      )
      .filter(Boolean);
    if (residues.length > 0) processedMatch.residues = residues;

    if (NOT_MEMBER_DBS.has(library)) {
      processedMatch.accession += ` (${mergedData.predictions.length + 1})`;
      processedMatch.source_database = library; // Making sure the change matches the ignore list.
      mergedData.predictions.push(processedMatch);
      continue;
    }
    const mergedMatch = mergeMatch(
      signatures.get(processedMatch.accession),
      processedMatch,
    );
    signatures.set(mergedMatch.accession, mergedMatch);
    if (match.signature.entry) {
      integrateSignature(mergedMatch, match.signature.entry, integrated);
    } else {
      mergedData.unintegrated[mergedMatch.accession] = mergedMatch;
    }
  }
  mergedData.unintegrated = Object.values(mergedData.unintegrated);
  integrated = Array.from(integrated.values()).map((m) => {
    const locations = flattenDeep(
      m.children.map((s) =>
        s.locations.map((l) => l.fragments.map((f) => [f.start, f.end])),
      ),
    );
    return {
      ...m,
      locations: [
        {
          fragments: [
            { start: Math.min(...locations), end: Math.max(...locations) },
          ],
        },
      ],
    };
  });
  mergedData.unintegrated.sort((m1, m2) => m2.score - m1.score);
  for (const entry of integrated) {
    if (!mergedData[entry.type]) mergedData[entry.type] = [];
    mergedData[entry.type].push(entry);
  }
  return mergedData;
};

const getEntryURL = ({ protocol, hostname, port, root }, accession) => {
  const description = {
    main: { key: 'entry' },
    entry: { db: 'interpro', accession },
  };
  return format({
    protocol,
    hostname,
    port,
    pathname: root + descriptionToPath(description),
  });
};

const changeTitle = (
  localID,
  results,
  updateJobTitle,
  inputRef,
  setTitle,
  setReadable,
) => {
  if (inputRef.current.readOnly) {
    inputRef.current.focus();
  } else {
    if (inputRef.current.value !== '') {
      results.xref[0].name = inputRef.current.value;
      const input = `>${inputRef.current.value} ${results.sequence}`;
      updateJobTitle(
        { metadata: { localID }, data: { input, results } },
        inputRef.current.value,
      );
      setTitle(inputRef.current.value);
    }
  }
  setReadable(!inputRef.current.readOnly);
};

const SummaryIPScanJob = ({
  accession,
  localID,
  remoteID,
  localTitle,
  status,
  data,
  localPayload,
  api,
  updateJobTitle,
}) => {
  const [mergedData, setMergedData] = useState({});
  const [familyHierarchyData, setFamilyHierarchyData] = useState([]);
  const [title, setTitle] = useState(localTitle);
  const [readable, setReadable] = useState(true);
  const titleInputRef = useRef();

  useEffect(() => {
    if (data.payload || localPayload) {
      const payload = data.payload ? data.payload.results[0] : localPayload;

      setTitle(localTitle || payload.xref[0].name);
      const organisedData = mergeData(payload.matches, payload.sequenceLength);
      setMergedData(organisedData);
      if (organisedData.family) {
        const families = [];
        organisedData.family.forEach((entry) => {
          fetchFun(getEntryURL(api, entry.accession)).then((data) => {
            if (data?.payload?.metadata) {
              families.push(data.payload.metadata);
              setFamilyHierarchyData([...families]);
            }
          });
        });
      }
    }
  }, [data.payload, localPayload]);

  useEffect(() => {
    setTitle(localTitle);
  }, [localTitle]);

  if (remoteID && remoteID !== accession) {
    return (
      <Redirect
        to={(customLocation) => ({
          ...customLocation,
          description: {
            ...customLocation.description,
            result: {
              ...customLocation.description.result,
              accession: remoteID,
            },
          },
        })}
      />
    );
  }

  const payload = data.payload ? data.payload.results[0] : localPayload;

  if (!payload) return <Loading />;

  const metadata = {
    accession,
    length: payload.sequence.length,
    sequence: payload.sequence,
    name: {
      name: 'InterProScan Search Result',
      short: payload.xref[0].name,
    },
  };

  const goTerms = getGoTerms(payload.matches);

  return (
    <div className={f('sections')}>
      <section>
        <Title metadata={metadata} mainType="protein" />
        <table
          className={f('light', 'table-sum', 'margin-bottom-none')}
          style={{ width: '70%' }}
        >
          <tbody>
            {title && (
              <tr>
                <td>Title</td>
                <td style={{ display: 'flex' }}>
                  <input
                    ref={titleInputRef}
                    className={f('title')}
                    defaultValue={`${title}`}
                    readOnly={readable}
                    style={{ width: `${title.length}ch` }}
                  />
                  {status === 'finished' ? (
                    <button
                      onClick={() =>
                        changeTitle(
                          localID,
                          payload,
                          updateJobTitle,
                          titleInputRef,
                          setTitle,
                          setReadable,
                        )
                      }
                    >
                      {readable ? (
                        <span
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf303;"
                          title={'Rename'}
                        />
                      ) : (
                        <span
                          className={f('icon', 'icon-common')}
                          data-icon="&#x53;"
                          title={'Save'}
                        />
                      )}
                    </button>
                  ) : null}
                </td>
              </tr>
            )}
            <tr>
              <td>
                Job ID{' '}
                <Tooltip title={'Case sensitive'}>
                  <span
                    className={f('small', 'icon', 'icon-common')}
                    data-icon="&#xf129;"
                    aria-label={'Case sensitive'}
                  />
                </Tooltip>
              </td>
              <td style={{ display: 'flex' }}>
                <Accession accession={accession} title="Job ID" />{' '}
                <CopyToClipboard
                  textToCopy={getIProScanURL(accession)}
                  tooltipText="CopyURL"
                />
              </td>
            </tr>
            <tr>
              <td>Length</td>
              <td>
                <Length metadata={metadata} />
              </td>
            </tr>
            {localID && (
              <tr>
                <td>Action</td>
                <td>
                  <Actions localID={localID} />
                </td>
              </tr>
            )}
            <tr>
              <td>Status</td>
              <td>
                <StatusTooltip status={status} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className={'row'}>
          <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
            <h5>Protein family membership</h5>
            {familyHierarchyData.length ? (
              <ProteinEntryHierarchy entries={familyHierarchyData} />
            ) : (
              <p className={f('margin-bottom-medium')}>None predicted</p>
            )}
          </div>
        </div>
      </section>

      {status === 'finished' && (
        <>
          <DomainOnProteinWithoutMergedData
            mainData={{ metadata }}
            dataMerged={mergedData}
          >
            {status === 'finished' && data?.url && (
              <Exporter includeSettings={false}>
                <ul>
                  {['tsv', 'json', 'xml', 'gff', 'svg', 'sequence'].map(
                    (type) => (
                      <li key={type}>
                        <Link
                          target="_blank"
                          href={data.url.replace('json', type)}
                          download={`InterProScan.${type}`}
                        >
                          {type.toUpperCase()}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </Exporter>
            )}
          </DomainOnProteinWithoutMergedData>
          <GoTerms terms={Array.from(goTerms.values())} type="protein" />
        </>
      )}
    </div>
  );
};
SummaryIPScanJob.propTypes = {
  accession: T.string.isRequired,
  localID: T.string.isRequired,
  remoteID: T.string,
  localTitle: T.string,
  status: T.string.isRequired,
  data: dataPropType,
  localPayload: T.object,
  api: T.object,
  updateJobTitle: T.func,
};

const jobMapSelector = (state) => state.jobs;
const accessionSelector = (state) =>
  state.customLocation.description.result.accession;

const jobSelector = createSelector(
  accessionSelector,
  jobMapSelector,
  (accession, jobMap) => {
    return Object.values(jobMap || {}).find(
      (job) =>
        job.metadata.remoteID === accession ||
        job.metadata.localID === accession,
    );
  },
);

const mapStateToProps = createSelector(
  accessionSelector,
  jobSelector,
  (state) => state.settings.api,
  (accession, { metadata: { localID, remoteID, status } }, api) => ({
    accession,
    localID,
    remoteID,
    status,
    api,
  }),
);

export default connect(mapStateToProps, { updateJobTitle })(SummaryIPScanJob);
