// @flow
import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

// $FlowFixMe
import getFetch from 'higherOrder/loadData/getFetch';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';

import Redirect from 'components/generic/Redirect';
import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
// $FlowFixMe
import GoTerms from 'components/GoTerms';
import Accession from 'components/Accession';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import Length from 'components/Protein/Length';
// $FlowFixMe
import DomainsOnProteinLoaded from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';
import Actions from 'components/IPScan/Actions';
import { getIProScanURL } from 'components/IPScan/Status';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideSummary from 'components/IPScan/NucleotideSummary';
import IPScanTitle from './IPScanTitle';
import SubJobsBrowser from '../SubJobsBrowser';
import { Exporter } from 'components/Table';
import { updateJobTitle } from 'actions/creators';

import StatusTooltip from './StatusTooltip';
import { mergeData } from './serializers';

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
};
*/

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

const getCreated = (payload, accession) => {
  let created = payload?.times?.created;
  if (!created) {
    const regex =
      /iprscan5-[SRI](\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-\d{4}-\d+-\w{2,4}/;
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
  const [versionMismatch, setVersionMismatch] = useState(false);
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
  // TODO: Check if thejob is still in the server to display or not the Exporter
  const reg = /(.+)(-\d+)$/;
  const match = reg.exec(accession);
  const rootAccession = match?.[1] ?? accession;
  return (
    <div className={f('sections')}>
      <section>
        {!data.payload && payload?.['interproscan-version'] ? (
          <div className={f('callout', 'info', 'withicon')}>
            Using data stored in your browser
          </div>
        ) : null}
        <IPScanVersionCheck
          ipScanVersion={payload['interproscan-version']}
          callback={setVersionMismatch}
        />
        <SubJobsBrowser />
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
            <header>Actions</header>
            <section>
              <Actions
                localID={localID}
                status={status}
                versionMismatch={versionMismatch}
                sequence={metadata.sequence}
                attributes={{
                  applications: localPayload?.applications,
                  goterms: localPayload?.goterms,
                  pathways: localPayload?.pathways,
                }}
              />
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
          <DomainsOnProteinLoaded
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
                        expired
                          ? dataURL
                          : `${dataURL}/${rootAccession}/${type}`
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
          </DomainsOnProteinLoaded>
          <GoTerms terms={Array.from(goTerms.values())} type="protein" />
        </>
      )}
    </div>
  );
};
SummaryIPScanJob.propTypes = {
  accession: T.string.isRequired,
  localID: T.string,
  remoteID: T.string,
  localTitle: T.string,
  status: T.string,
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
  (accession, job, api, ipScan) => ({
    accession,
    localID: job?.metadata?.localID,
    remoteID: job?.metadata?.remoteID,
    status: job?.metadata?.status,
    api,
    ipScan,
  }),
);

export default connect(mapStateToProps, { updateJobTitle })(SummaryIPScanJob);
