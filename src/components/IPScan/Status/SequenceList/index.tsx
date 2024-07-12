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

import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import getTableAccess, { IPScanJobsData } from 'storage/idb';
import Accession from 'components/Accession';

import config from 'config';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';
import tableStyles from 'components/Table/style.css';
import summary from 'styles/summary.css';
import StatusTooltip from '../../Summary/StatusTooltip';
import { MAX_TIME_ON_SERVER } from 'store/enhancer/jobs-middleware';
import ResultImporter from '../../ResultImporter';

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

type Props = {
  job?: IprscanMetaIDB;
  search: InterProLocationSearch;
  defaultPageSize: number;
  updateJobStatus: typeof updateJobStatus;
  updateJobTitle: typeof updateJobTitle;
};

export const IPScanStatus = ({
  job,
  search,
  defaultPageSize,
  updateJobStatus,
  // updateJobTitle,
}: Props) => {
  const [jobsData, setJobsData] = useState<Array<IprscanDataIDB>>([]);
  const [shouldImportResults, setShouldImportResults] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const getSequencesData = async (job: IprscanMetaIDB) => {
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
  return (
    <section>
      <h3 className={css('light')}>
        Your InterProScan Search Results (Sequences){' '}
        <TooltipAndRTDLink rtdPage="searchways.html#sequence-search-results" />
      </h3>
      {/* <IPScanTitle
        localTitle={job?.localTitle || ' '}
        localID={job?.localID}
        // payload={{ job }}
        // updateJobTitle={updateJobTitle}
        status={job?.status}
      /> */}

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
      <section className={css('summary-row')}>
        <header>Number of Sequences</header>
        <section>{job?.entries || 1}</section>
      </section>
      {
        // TODO: Add the actions that concern the whole job
        /* <section className={css('summary-row')}>
        <header>Actions</header>
        <section>TODO</section>
      </section> */
      }
      <section className={css('summary-row')}>
        <header>Status</header>
        <section>
          <StatusTooltip status={job?.status} />
        </section>
      </section>
      {job?.status === 'finished' && (
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
          <section>
            {new Date(
              (job?.times.created || 0) + MAX_TIME_ON_SERVER,
            ).toDateString()}
          </section>
        </section>
      )}
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
                  {row.results[0]?.xref?.[0]?.name ||
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
          Results
        </Column>
        <Column
          defaultKey="matches"
          dataKey="results"
          // isSearchable={true}
          // isSortable={true}
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
  (state: GlobalState) =>
    Object.values(state.jobs || {}).find(
      (job) =>
        job.metadata.remoteID === state.customLocation.description.result.job,
    ),
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.navigation.pageSize,
  (job, search, defaultPageSize) => ({
    job: job?.metadata,
    search,
    defaultPageSize,
  }),
);

export default connect(mapsStateToProps, { updateJobStatus, updateJobTitle })(
  IPScanStatus,
);