// @flow
import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flattenDeep } from 'lodash-es';
import { format } from 'url';

import getFetch from 'higherOrder/loadData/getFetch';
import { NOT_MEMBER_DBS } from 'menuConfig';
import { iproscan2urlDB } from 'utils/url-patterns';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';

import Redirect from 'components/generic/Redirect';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';
import GoTerms from 'components/GoTerms';
import Accession from 'components/Accession';
import Title from 'components/Title';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import Length from 'components/Protein/Length';
import { DomainOnProteinWithoutMergedData } from 'components/Related/DomainsOnProtein';
import Actions from 'components/IPScan/Actions';
import { getIProScanURL } from 'components/IPScan/Status';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideSummary from 'components/IPScan/NucleotideSummary';
import IPScanTitle from './IPScanTitle';
import { Exporter } from 'components/Table';
import { updateJobTitle } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import style from './style.css';
import summary from 'styles/summary.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(summary, theme, ebiGlobalStyles, fonts, style);

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

const _StatusTooltip = ({ status /*: string */ }) => (
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
    {['finished', 'imported file', 'saved in browser'].includes(status) && (
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
);
_StatusTooltip.propTypes = {
  status: T.oneOf([
    'running',
    'created',
    'importing',
    'imported file',
    'saved in browser',
    'submitted',
    'not found',
    'failure',
    'error',
    'finished',
  ]),
};
const StatusTooltip = React.memo(_StatusTooltip);
StatusTooltip.displayName = 'StatusTooltip';

const mergeData = (matches, sequenceLength) => {
  const mergedData /*: {unintegrated:any[], predictions: any[], family?: any[]} */ = {
    unintegrated: [],
    predictions: [],
  };
  const unintegrated = {};
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
      residues: undefined,
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
      unintegrated[mergedMatch.accession] = mergedMatch;
    }
  }
  mergedData.unintegrated = (Object.values(unintegrated) /*: any */);
  integrated = Array.from(integrated.values()).map((m) => {
    const locations = flattenDeep(
      (m.children /*: any */)
        .map((s /*: {locations: Array<{fragments: Array<Object>}>} */) =>
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
  (mergedData.unintegrated /*: any[] */)
    .sort((m1, m2) => m2.score - m1.score);
  for (const entry of integrated) {
    if (!mergedData[entry.type]) mergedData[entry.type] = [];
    mergedData[entry.type].push(entry);
  }
  return mergedData;
};

const getCreated = (payload, accession) => {
  let created = payload?.times?.created;
  if (!created) {
    const regex = /iprscan5-[SRI](\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-\d{4}-\d+-\w{2,4}/;
    const matches = regex.exec(accession);
    if (matches) {
      const [_, y, m, d, hh, mm, ss] = matches;
      created = Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss);
    }
  }
  return created;
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

// eslint-disable-next-line complexity
const SummaryIPScanJob = ({
  accession,
  localID,
  remoteID,
  localTitle,
  status,
  data,
  localPayload,
  api,
  ipScan,
  updateJobTitle,
}) => {
  const [mergedData, setMergedData] = useState({});
  const [familyHierarchyData, setFamilyHierarchyData] = useState([]);

  useEffect(() => {
    if (data.payload || localPayload) {
      const payload = data.payload ? data.payload.results[0] : localPayload;

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

  const payload = data.payload
    ? {
        ...data.payload.results[0],
        'interproscan-version': data.payload?.['interproscan-version'],
      }
    : localPayload;

  if (!payload) return <Loading />;

  const created = getCreated(payload, accession);

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

  const { protocol, hostname, root } = ipScan;
  let dataURL = `${protocol}//${hostname}${root}result`;
  const now = Date.now();
  const expired =
    (now - (created || now) > MAX_TIME_ON_SERVER &&
      status === 'saved in browser') ||
    status === 'imported file';
  if (expired) {
    const downloadContent = JSON.stringify(payload);
    const blob = new Blob([downloadContent], { type: 'application/json' });
    dataURL = URL.createObjectURL(blob);
  }

  return (
    <div className={f('sections')}>
      <section>
        <Title metadata={metadata} mainType="protein" />
        {!data.payload && payload?.['interproscan-version'] ? (
          <div className={f('callout', 'info', 'withicon')}>
            Using data stored in your browser
          </div>
        ) : null}
        <IPScanVersionCheck ipScanVersion={payload['interproscan-version']} />
        <NucleotideSummary payload={payload} />
        <IPScanTitle
          localTitle={localTitle}
          localID={localID}
          payload={payload}
          updateJobTitle={updateJobTitle}
          status={status}
        />

        <section className={f('summary-row')}>
          <header>
            Job ID{' '}
            <Tooltip title={'Case sensitive'}>
              <span
                className={f('small', 'icon', 'icon-common')}
                data-icon="&#xf129;"
                aria-label={'Case sensitive'}
              />
            </Tooltip>
          </header>
          <section style={{ display: 'flex' }}>
            <Accession accession={accession} title="Job ID" />{' '}
            <CopyToClipboard
              textToCopy={getIProScanURL(accession)}
              tooltipText="CopyURL"
            />
          </section>
        </section>
        <section className={f('summary-row')}>
          <header>Length</header>
          <section>
            <Length metadata={metadata} />
          </section>
        </section>
        {localID && (
          <section className={f('summary-row')}>
            <header>Action</header>
            <section>
              <Actions localID={localID} status={status} />
            </section>
          </section>
        )}
        <section className={f('summary-row')}>
          <header>Status</header>
          <section>
            <StatusTooltip status={status} />
          </section>
        </section>
        {status === 'finished' && (
          <section className={f('summary-row')}>
            <header>
              Expires{' '}
              <Tooltip
                title={
                  'InterProScan Jobs are only kept in our servers for 1 week.'
                }
              >
                <span
                  className={f('small', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                  aria-label={'Case sensitive'}
                />
              </Tooltip>
            </header>
            <section>
              {new Date(created + MAX_TIME_ON_SERVER).toDateString()}
            </section>
          </section>
        )}

        <div className={'row'}>
          <div
            className={f(
              'medium-9',
              'columns',
              'margin-bottom-large',
              'margin-top-large',
            )}
          >
            <h4>Protein family membership</h4>
            {familyHierarchyData.length ? (
              <ProteinEntryHierarchy entries={familyHierarchyData} />
            ) : (
              <p className={f('margin-bottom-medium')}>None predicted</p>
            )}
          </div>
        </div>
      </section>

      {['finished', 'imported file', 'saved in browser'].includes(status) && (
        <>
          <DomainOnProteinWithoutMergedData
            mainData={{ metadata }}
            dataMerged={mergedData}
          >
            <Exporter includeSettings={false}>
              <ul>
                {['tsv', 'json', 'xml', 'gff', 'sequence'].map((type) => (
                  <li key={type}>
                    <Link
                      target="_blank"
                      href={
                        expired ? dataURL : `${dataURL}/${accession}/${type}`
                      }
                      download={`InterProScan.${type}`}
                      disabled={expired && type !== 'json'}
                    >
                      {type.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </Exporter>
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
  ipScan: T.object,
  updateJobTitle: T.func,
};

const jobMapSelector = (state) => state.jobs;
const accessionSelector = (state) =>
  state.customLocation.description.result.accession;

const jobSelector = createSelector(
  accessionSelector,
  jobMapSelector,
  (accession, jobMap) => {
    // prettier-ignore
    return (Object.values(jobMap || {}) /*: any */)
      .find(
        (
          job /*: {metadata:{remoteID: string, localID: string, status: string}} */,
        ) =>
          job.metadata.remoteID === accession ||
          job.metadata.localID === accession,
      );
  },
);

const mapStateToProps = createSelector(
  accessionSelector,
  jobSelector,
  (state) => state.settings.api,
  (state) => state.settings.ipScan,
  (accession, { metadata: { localID, remoteID, status } }, api, ipScan) => ({
    accession,
    localID,
    remoteID,
    status,
    api,
    ipScan,
  }),
);

export default connect(mapStateToProps, { updateJobTitle })(SummaryIPScanJob);
