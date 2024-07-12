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
// $FlowFixMe
import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';

import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
// $FlowFixMe
import GoTerms from 'components/GoTerms';
// $FlowFixMe
import Accession from 'components/Accession';
// $FlowFixMe
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
// $FlowFixMe
import Length from 'components/Protein/Length';
// $FlowFixMe
import DomainsOnProteinLoaded from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';
// $FlowFixMe
import Actions from 'components/IPScan/Actions';
// $FlowFixMe
import { getIProScanURL } from 'components/IPScan/Status';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideSummary from 'components/IPScan/NucleotideSummary';
// $FlowFixMe
import IPScanTitle from './IPScanTitle';
import SubJobsBrowser from '../SubJobsBrowser';
// $FlowFixMe
import { Exporter } from 'components/Table';
import { updateJobTitle } from 'actions/creators';

// $FlowFixMe
import StatusTooltip from './StatusTooltip';
// $FlowFixMe
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
  data: {
    loading: boolean,
    payload: {
      results: Array<Object>,
    },
  },
  localPayload: ?Object,
};
*/

const getInterProGoTerms = (matches) => {
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
  return Array.from(goTerms.values());
};

const getPantherGoTerms = (matches) => {
  const goTerms = new Map();

  for (const match of matches) {
    const db = match.signature.signatureLibraryRelease.library.toLowerCase();
    const goXRefs = match.goXRefs || [];

    if (db === 'panther' && goXRefs.length !== 0) {
      goXRefs.forEach(({ id, category, name }) => {
        if (category !== null && name !== null) {
          goTerms.set(id, {
            category: {
              name: category.toLowerCase(),
              code: category[0],
            },
            name,
            identifier: id,
          });
        }
      });
    }
  }

  return Array.from(goTerms.values());
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
  jobAccession,
  seqAccession,
  localID,
  // remoteID,
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

  const payload = data.payload
    ? {
        ...data.payload.results[0],
        'interproscan-version': data.payload?.['interproscan-version'],
      }
    : localPayload;

  if (!payload) return <Loading />;

  const created = getCreated(payload, jobAccession);

  const metadata = {
    accession: jobAccession,
    length: payload.sequence.length,
    sequence: payload.sequence,
    name: {
      name: 'InterProScan Search Result',
      short: payload.xref[0].name,
    },
  };

  const interProGoTerms = getInterProGoTerms(payload.matches);
  const pantherGoTerms = getPantherGoTerms(payload.matches);

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
  const match = reg.exec(jobAccession);
  const rootAccession = match?.[1] ?? jobAccession;
  return (
    <div className={f('sections')}>
      <section>
        <IPScanVersionCheck
          ipScanVersion={payload['interproscan-version']}
          callback={setVersionMismatch}
        />
        <SubJobsBrowser />
        <NucleotideSummary payload={payload} />
        <IPScanTitle
          seqAccession={seqAccession}
          payload={payload}
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
            <Link
              to={{
                description: {
                  main: { key: 'result' },
                  result: {
                    job: jobAccession,
                    type: 'InterProScan',
                  },
                },
              }}
            >
              <Accession accession={jobAccession} title="Job ID" />{' '}
            </Link>
            <CopyToClipboard
              textToCopy={getIProScanURL(jobAccession)}
              tooltipText="Copy URL"
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
                      buttonType="secondary"
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
          <GoTerms terms={interProGoTerms} type="protein" />
          <GoTerms terms={pantherGoTerms} type="entry" db="PANTHER" />
        </>
      )}
    </div>
  );
};

SummaryIPScanJob.propTypes = {
  jobAccession: T.string.isRequired,
  localID: T.string,
  remoteID: T.string,
  status: T.string,
  data: dataPropType,
  localPayload: T.object,
  api: T.object,
  ipScan: T.object,
  updateJobTitle: T.func,
};

const jobSelector = createSelector(
  (state) => state.customLocation.description.result.job,
  (state) => state.jobs,
  (jobAccession, jobMap) => {
    // prettier-ignore
    return (Object.values(jobMap || {}) /*: any */)
      .find(
        (
          job /*: {metadata:{remoteID: string, localID: string, status: string}} */,
        ) =>
          job.metadata.remoteID === jobAccession ||
          job.metadata.localID === jobAccession,
      );
  },
);

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.result.job,
  (state) => state.customLocation.description.result.accession,
  jobSelector,
  (state) => state.settings.api,
  (state) => state.settings.ipScan,
  (jobAccession, seqAccession, job, api, ipScan) => ({
    jobAccession,
    seqAccession,
    localID: job?.metadata?.localID,
    remoteID: job?.metadata?.remoteID,
    status: job?.metadata?.status,
    api,
    ipScan,
  }),
);

export default connect(mapStateToProps, { updateJobTitle })(SummaryIPScanJob);
