import React, { useEffect, useState } from 'react';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { updateJobStatus, updateJobTitle } from 'actions/creators';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { filterSubset, sortSubsetBy } from 'components/Table/FullyLoadedTable';
import Table, { Column } from 'components/Table';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import getTableAccess, { IPScanJobsData } from 'storage/idb';
import Accession from 'components/Accession';

import config from 'config';

import StatusTooltip from '../../Summary/StatusTooltip';
import ResultImporter from '../../ResultImporter';
import Actions from '../../Actions';
import DownloadAll from '../../Actions/Group/DownloadAll';
import ReRun from '../../Actions/Group/ReRun';

import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';
import tableStyles from 'components/Table/style.css';
import summary from 'styles/summary.css';
import IPScanTitle from '../../Summary/IPScanTitle';
import IPScanVersionCheck from '../../IPScanVersionCheck';

const css = cssBinder(fonts, local, tableStyles, summary);

export const getIProScanURL = (accession: string) => {
  const { protocol, hostname, port, pathname } = config.root.website;
  const url = format({
    protocol,
    hostname,
    port,
    pathname:
      pathname +
      descriptionToPath({
        main: { key: 'result' },
        result: { type: 'InterProScan', accession },
      }),
  });

  return url;
};

type JobAdditionalMetadata = {
  jobRunTime: {
    endTime: string;
    startTime: string;
    jobId: string;
  };
};

type Props = {
  ipScan: ParsedURLServer;
  job?: MinimalJobMetadata;
  search: InterProLocationSearch;
  defaultPageSize: number;
  updateJobStatus: typeof updateJobStatus;
  updateJobTitle: typeof updateJobTitle;
};

export const IPScanStatus = ({
  ipScan,
  job,
  search,
  defaultPageSize,
  updateJobStatus,
  // updateJobTitle,
}: Props) => {
  const [jobsData, setJobsData] = useState<Array<IprscanDataIDB>>([]);
  const [expiryDate, setExpiryDate] = useState(new Date());

  const [shouldImportResults, setShouldImportResults] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  // const [versionMismatch, setVersionMismatch] = useState(false);
  const getSequencesData = async (job: MinimalJobMetadata) => {
    const dataT = await getTableAccess(IPScanJobsData);
    const jobsData: Array<IprscanDataIDB> = [];
    const data = (await dataT.get(job?.localID)) as IprscanDataIDB;
    if (data && data.results?.length) jobsData.push(data);
    for (let i = 1; i <= (job?.entries || 1); i++) {
      const data = await dataT.get(`${job?.localID}-${i}`);
      if (data) jobsData.push(data);
    }
    return jobsData;
  };

  useEffect(() => {
    if (job) {
      getSequencesData(job).then((data) => setJobsData(data));
    } else if (!isImporting) {
      setShouldImportResults(true);
      setIsImporting(true);
      updateJobStatus();
    }
  }, [job, isImporting]);

  useEffect(() => {
    const setJobExpiryDate = async (job: MinimalJobMetadata) => {
      const ipScanURL = format({
        protocol: ipScan.protocol,
        hostname: ipScan.hostname,
        port: ipScan.port,
        pathname: ipScan.root,
      });

      const jobMetadataRequest = await fetch(
        `${ipScanURL}/jobruntime/${job.remoteID}`,
      );

      const jobMetadata = await jobMetadataRequest.json();
      const endDateString = (jobMetadata as JobAdditionalMetadata).jobRunTime
        .endTime;
      const endDateMilliSeconds = Date.parse(
        endDateString.replace('BST', 'GMT+0100'),
      );
      const newExpiryDate = new Date(
        (job?.times?.created || endDateMilliSeconds) + MAX_TIME_ON_SERVER,
      );
      setExpiryDate(newExpiryDate);
    };

    if (job) {
      setJobExpiryDate(job || '');
    }
  }, [job]);

  if (!job)
    return (
      <ResultImporter
        shouldImport={shouldImportResults}
        handleImported={() => {
          setShouldImportResults(false);
          setIsImporting(false);
        }}
      />
    );
  const keys = ['localTitle', 'matches', 'sequence'];
  let paginatedJobs = [...jobsData];
  sortSubsetBy<IprscanDataIDB>(paginatedJobs, search, keys, {
    localTitle: (localID, row) =>
      row?.results?.[0].xref?.[0]?.name || (localID as string),
  });
  paginatedJobs = filterSubset(paginatedJobs, search, keys, {
    localTitle: (localID, row) =>
      row?.results?.[0].xref?.[0]?.name || (localID as string),
  });
  const pageSize = search.page_size || defaultPageSize;
  paginatedJobs = paginatedJobs.splice(
    ((Number(search.page) || 1) - 1) * Number(pageSize),
    Number(pageSize),
  );

  const jobIPScanVersion = jobsData?.[0]?.['interproscan-version'];
  const jobIProVersion = jobsData?.[0]?.['interpro-version'];

  return (
    <section>
      <IPScanVersionCheck ipScanVersion={jobIProVersion} />

      <h3 className={css('light')}>
        Your InterProScan Search Results (Sequences){' '}
        <TooltipAndRTDLink rtdPage="searchways.html#sequence-search-results" />
      </h3>

      <IPScanTitle
        type="job"
        accession={job?.localID || ''}
        localTitle={job?.localTitle || ''}
        status={job?.status}
        payload={job}
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
          <Accession
            accession={job?.remoteID || job?.localID || ''}
            title="Job ID"
          />{' '}
          {/* <CopyToClipboard
              textToCopy={getIProScanURL(accession)}
              tooltipText="Copy URL"
            /> */}
        </section>
      </section>
      {jobIProVersion && (
        <section className={css('summary-row')}>
          <header>InterPro Version</header>
          <section>{jobIProVersion}</section>
        </section>
      )}
      {jobIPScanVersion && (
        <section className={css('summary-row')}>
          <header>InterProScan Version</header>
          <section>{jobIPScanVersion}</section>
        </section>
      )}
      <section className={css('summary-row')}>
        <header>Sequence type</header>
        <section>
          {job?.seqtype === 'n' ? 'Nucleotides' : 'Amino acids'}
        </section>
      </section>
      <section className={css('summary-row')}>
        <header>Number of Sequences</header>
        <section>{job?.entries || 1}</section>
      </section>
      <section className={css('summary-row')}>
        <header>Status</header>
        <section>
          <StatusTooltip status={job?.status} />
        </section>
      </section>
      {job?.status === 'finished' && expiryDate >= new Date() && (
        <section className={css('summary-row')}>
          <header>
            Expires{' '}
            <Tooltip
              title={
                'InterProScan Jobs are only kept in our servers for 1 week.'
              }
            >
              <span
                className={css('small', 'icon', 'icon-common')}
                data-icon="&#xf129;"
                aria-label={'Case sensitive'}
              />
            </Tooltip>
          </header>
          <section>{expiryDate.toDateString()}</section>
        </section>
      )}
      <section className={css('summary-row')}>
        <header>Actions</header>
        <section>
          <Actions
            localID={job?.localID || ''}
            status={job?.status || ''}
            MoreActions={
              <>
                <ReRun jobsData={jobsData} />
                <DropDownButton label="Download" icon="icon-download">
                  <DownloadAll job={job} jobsData={jobsData} />
                </DropDownButton>
              </>
            }
          />
        </section>
      </section>
      <Table
        dataTable={paginatedJobs}
        rowKey="localID"
        contentType="result"
        actualSize={job?.entries || 1}
        query={search}
        showTableIcon={false}
        // groupActions={GroupActions}
      >
        <Column
          dataKey="localTitle"
          isSearchable={true}
          isSortable={true}
          renderer={(localTitle: string, row: IprscanDataIDB) => (
            <>
              <span style={{ marginRight: '1em' }}>
                <Link
                  to={{
                    description: {
                      main: { key: 'result' },
                      result: {
                        type: 'InterProScan',
                        job: job?.remoteID,
                        accession: row.localID,
                      },
                    },
                  }}
                >
                  {(row.results[0]?.crossReferences ||
                    row.results[0]?.xref)?.[0]?.id ||
                    (localTitle === '∅' ? null : localTitle) ||
                    row.localID}
                </Link>
              </span>
              {/* {row.remoteID && !row.remoteID.startsWith('imported') && (
                <CopyToClipboard
                  textToCopy={getIProScanURL(row.remoteID)}
                  tooltipText="Copy URL"
                />
              )} */}
            </>
          )}
        >
          Sequence
        </Column>
        <Column
          defaultKey="matches"
          dataKey="results"
          // isSearchable={true}
          // isSortable={true}
          displayIf={job.seqtype !== 'n'}
          renderer={(results: Array<Iprscan5Result>) =>
            results[0].matches.length
          }
        >
          Matches
        </Column>
        <Column
          defaultKey="length"
          dataKey="results"
          // isSearchable={true}
          // isSortable={true}
          renderer={(results: Array<Iprscan5Result>) =>
            results[0].sequence.length
          }
        >
          Sequence length
        </Column>

        {/* <Column
          dataKey="localID"
          defaultKey="actions"
          headerClassName={css('table-header-center')}
          cellClassName={css('table-center', 'font-ml')}
          renderer={(localID: string) => (
            <Actions localID={localID} forStatus={true} />
          )}
        >
          Action
        </Column> */}
      </Table>
    </section>
  );
};

const mapsStateToProps = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  (state: GlobalState) =>
    Object.values(state.jobs || {}).find(
      (job) =>
        job.metadata.remoteID === state.customLocation.description.result.job,
    ),
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.navigation.pageSize,
  (ipScan, job, search, defaultPageSize) => ({
    ipScan: ipScan,
    job: job?.metadata,
    search,
    defaultPageSize,
  }),
);

export default connect(mapsStateToProps, { updateJobStatus, updateJobTitle })(
  IPScanStatus,
);
