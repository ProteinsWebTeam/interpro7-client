import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import getFetch from 'higherOrder/loadData/getFetch';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
import GoTerms from 'components/GoTerms';
import Accession from 'components/Accession';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import Length from 'components/Protein/Length';
import DomainsOnProteinLoaded from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';
import { Exporter } from 'components/Table';

import Actions from '../Actions';
import { getIProScanURL } from '../Status';
import IPScanVersionCheck from '../IPScanVersionCheck';
import NucleotideSummary from '../NucleotideSummary';
import SubJobsBrowser from '../SubJobsBrowser';
import IPScanTitle from './IPScanTitle';
import StatusTooltip from './StatusTooltip';
import { mergeData } from './serializers';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';
import summary from 'styles/summary.css';

const css = cssBinder(summary, fonts, style);

const fetchFun = getFetch({ method: 'GET', responseType: 'JSON' });

const getInterProGoTerms = (matches: Array<Iprscan5Match>) => {
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

const getPantherGoTerms = (matches: Array<Iprscan5Match>) => {
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

const getCreated = (
  payload: IprscanMetaIDB | LocalPayload,
  accession: string,
) => {
  let created = (payload as IprscanMetaIDB)?.times?.created;
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
const getEntryURL = (
  { protocol, hostname, port, root }: ParsedURLServer,
  accession: string,
) => {
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

type Props = {
  jobAccession: string;
  seqAccession: string;
  localID: string;
  // remoteID?: string,
  status?: JobStatus;
  data: {
    loading: boolean;
    payload: Iprscan5Payload;
  };
  api: ParsedURLServer;
  ipScan: ParsedURLServer;
  localPayload: LocalPayload;
};

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
}: Props) => {
  const [mergedData, setMergedData] = useState({});
  const [versionMismatch, setVersionMismatch] = useState(false);
  const [familyHierarchyData, setFamilyHierarchyData] = useState<
    Array<EntryMetadata>
  >([]);

  useEffect(() => {
    if (data.payload || localPayload) {
      const payload = data.payload ? data.payload.results[0] : localPayload;

      const organisedData = mergeData(payload.matches, payload.sequenceLength);
      setMergedData(organisedData);
      if (organisedData.family) {
        const families: Array<EntryMetadata> = [];
        organisedData.family.forEach((entry) => {
          fetchFun(
            getEntryURL(api, (entry as unknown as EntryMetadata).accession),
          ).then((data) => {
            const entryData = data as RequestedData<
              MetadataPayload<EntryMetadata>
            >;
            const entryPayload = entryData?.payload;
            if (entryPayload?.metadata) {
              families.push(entryPayload.metadata);
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

  if (!payload || !status) return <Loading />;

  const created = getCreated(payload, jobAccession);

  const metadata: MinimalProteinMetadata & { name: NameObject } = {
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
    <div className={css('sections')}>
      <section>
        <IPScanVersionCheck
          ipScanVersion={payload['interproscan-version']}
          callback={setVersionMismatch}
        />
        <SubJobsBrowser />
        {/* TODO: re-enable nucleotides
        <NucleotideSummary payload={payload} /> */}
        <IPScanTitle
          seqAccession={seqAccession}
          payload={payload}
          status={status}
        />

        <section className={css('summary-row')}>
          <header>
            Job ID{' '}
            <Tooltip title={'Case sensitive'}>
              <span
                className={css('small', 'icon', 'icon-common')}
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
        <section className={css('summary-row')}>
          <header>Length</header>
          <section>
            <Length metadata={metadata} />
          </section>
        </section>
        {localID && (
          <section className={css('summary-row')}>
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
        <section className={css('summary-row')}>
          <header>Status</header>
          <section>
            <StatusTooltip status={status} />
          </section>
        </section>

        <div className={'row'}>
          <div
            className={css(
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
              <p className={css('margin-bottom-medium')}>None predicted</p>
            )}
          </div>
        </div>
      </section>

      {['finished', 'imported file', 'saved in browser'].includes(status) && (
        <>
          <DomainsOnProteinLoaded
            mainData={{ metadata }}
            dataMerged={mergedData}
            loading={false}
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

const jobSelector = createSelector(
  (state: GlobalState) => state.customLocation.description.result.job,
  (state: GlobalState) => state.jobs,
  (jobAccession, jobMap) => {
    return Object.values(jobMap || {}).find(
      (job) =>
        job.metadata.remoteID === jobAccession ||
        job.metadata.localID === jobAccession,
    );
  },
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.result.job || '',
  (state: GlobalState) =>
    state.customLocation.description.result.accession || '',
  jobSelector,
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.settings.ipScan,
  (jobAccession, seqAccession, job, api, ipScan) => ({
    jobAccession,
    seqAccession,
    localID: job?.metadata?.localID || '',
    remoteID: job?.metadata?.remoteID || '',
    status: job?.metadata?.status,
    api,
    ipScan,
  }),
);

export default connect(mapStateToProps)(SummaryIPScanJob);