import url from 'url';
import { schedule } from 'timing-functions';
import { Dispatch, Middleware, UnknownAction } from 'redux';

import { createNotification } from 'utils/browser-notifications';
import {
  cachedFetchJSON,
  cachedFetchText,
  cachedFetchXML,
} from 'utils/cached-fetch';
import id from 'utils/cheap-unique-id';

import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  UPDATE_JOB_STATUS,
  UPDATE_JOB_TITLE,
  KEEP_JOB_AS_LOCAL,
  NEW_PROCESSED_CUSTOM_LOCATION,
  IMPORT_JOB,
  IMPORT_JOB_FROM_DATA,
  UPDATE_SEQUENCE_JOB_TITLE,
  IPScanAction,
  IPScanMetadataAction,
} from 'actions/types';
import { rehydrateJobs, updateJob, addToast } from 'actions/creators';

import config from 'config';

import getTableAccess, { IPScanJobsMeta, IPScanJobsData } from 'storage/idb';

const DEFAULT_SCHEDULE_DELAY = 1000 * 2; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 1000 * 10; // ten seconds
export const MAX_TIME_ON_SERVER = 1000 * 60 * 60 * 24 * 7; // one week

type JobAction = {
  type: string;
  job: {
    data: IprscanDataIDB;
    metadata: IprscanMetaIDB;
  };
  value?: string;
  localID?: string;
};
type nameAction = {
  type: string;
  jobID: string;
  value: string;
};

const metaTA = getTableAccess(IPScanJobsMeta);
const dataTA = getTableAccess(IPScanJobsData);

const deleteJobInDB = async (localID: string) => {
  const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
  metaT.delete(localID);
  for (const [key] of Object.entries(
    (await dataT.getAll()) as Record<string, IprscanMetaIDB>,
  )) {
    if (key.startsWith(localID)) {
      dataT.delete(key);
    }
  }
};

const rehydrateStoredJobs = async (dispatch: Dispatch<IPScanAction>) => {
  await schedule(DEFAULT_SCHEDULE_DELAY);
  const metaT = await metaTA;
  const meta = (await metaT.getAll()) as Record<string, MinimalJobMetadata>;
  const entries = Object.entries(meta);
  if (!entries.length) return dispatch(rehydrateJobs({}));
  const jobs: JobsState = {};
  const now = Date.now();
  for (const [localID, metadata] of entries) {
    // if job expired on server, delete it
    if (
      now - (metadata.times?.created || now) > MAX_TIME_ON_SERVER &&
      !['saved in browser', 'imported file'].includes(metadata.status || '')
    ) {
      deleteJobInDB(localID);
    } else {
      jobs[localID] = { metadata };
    }
  }
  dispatch(rehydrateJobs(jobs));
};

const createJobInDB = async (
  metadata: MinimalJobMetadata,
  data: IprscanDataIDB,
) => {
  const { localID } = metadata;
  try {
    // add data and metadata to idb
    const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
    await Promise.all([dataT.set(data, localID), metaT.set(metadata, localID)]);
  } catch {
    // cleanup if anything bad happens
    deleteJobInDB(localID!);
  }
};

const updateJobTitleDB = async (jobID: string, title: string) => {
  const metaT = await metaTA;

  metaT.update(jobID, (prev: IprscanMetaIDB) => ({
    ...prev,
    localTitle: title,
  }));
};
const updateSequenceTitleDB = async (jobSequenceID: string, title: string) => {
  const dataT = await dataTA;

  dataT.update(jobSequenceID, (prev: IprscanDataIDB) => ({
    ...prev,
    results: [
      {
        ...prev.results[0],
        xref: [{ name: title, id: title.replaceAll(' ', '') }],
      },
    ],
  }));
};

const updateJobInDB = async (
  metadata: MinimalJobMetadata,
  data?: IprscanDataIDB,
  dispatch?: Dispatch,
) => {
  const [metaT, dataT] = await Promise.all([metaTA, dataTA]);
  const { remoteID, localID, group } = metadata;
  if (data) {
    metadata.entries = data?.results?.length;
    metadata.seqtype =
      'openReadingFrames' in (data?.results?.[0] || {}) ? 'n' : 'p';
    if (data?.results?.length > 1 && !group) {
      const now = new Date();
      metadata.group =
        metadata.group ||
        `${now.getFullYear()}${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now
          .getHours()
          .toString()
          .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
          .getSeconds()
          .toString()
          .padStart(2, '0')}`;
    }
  }
  metaT.set(metadata, metadata.localID);

  (Array.isArray(data?.results) ? data?.results : []).forEach((result, i) => {
    const newLocalID = `${localID}-${i + 1}`;

    // Standardize IPScan5 and IPScan6 versions
    let ipScanVersion: string = '';
    let iProVersion: string = '';

    if (data) {
      ipScanVersion = data['interproscan-version'] || '';
      if (data['interpro-version']) iProVersion = data['interpro-version'];
      else iProVersion = ipScanVersion.split('-')[1];
    }

    dataT.set(
      {
        ...data,
        'interproscan-version': ipScanVersion,
        'interpro-version': iProVersion,
        results: [result],
        localID: newLocalID,
      },
      newLocalID,
    );
  });
  if (dispatch) {
    rehydrateStoredJobs(dispatch);
  }
};

type ImportedParametersPayload = {
  execution: {
    userParameters: {
      entry: Array<{
        string: string;
        boolean?: boolean;
        'string-array'?: {
          string: string[];
        };
      }>;
    };
  };
};
const processImportedAttributes = (
  payload: ImportedParametersPayload,
): { applications: string[] | null } => {
  let applications = null;
  const parameters = payload?.execution?.userParameters?.entry || [];
  parameters.forEach((parameter) => {
    switch (parameter?.string) {
      case 'appl':
        applications = parameter?.['string-array']?.string || [];
        break;
      default:
        break;
    }
  });
  return { applications };
};

const middleware: Middleware<
  {},
  GlobalState,
  Dispatch<IPScanMetadataAction | UnknownAction>
> = ({ dispatch, getState }) => {
  // function definitions

  const processJob = async (localID: string, meta: MinimalJobMetadata) => {
    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);
    if (meta.status === 'failed') return;
    if (meta.status === 'created') {
      const dataT = await dataTA;
      const { input, applications } = (await dataT.get(
        localID,
      )) as IprscanDataIDB;

      const ipScanInfo = getState().settings.ipScan;

      // Here is where we actually submit the sequence to InterProScan servers
      const { payload: remoteID, ok } = (await cachedFetchText(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          'run',
        ),
        {
          // @ts-expect-error until cached-fetch is migrated
          useCache: false,
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          body: url
            .format({
              query: {
                email: config.IPScan.contactEmail,
                title: localID,
                sequence: input,
                appl: applications,
                stype: meta.seqtype || 'p',
              },
            })
            .replace(/^\?/, ''),
        },
        // TODO: Update when cache-cetch is migrated
      )) as unknown as { payload: string; ok: boolean };
      if (ok) {
        dispatch(
          updateJob({ metadata: { ...meta, remoteID, status: 'submitted' } }),
        );
      } else {
        dispatch(updateJob({ metadata: { ...meta, status: 'failed' } }));
      }
      return;
    }
    if (
      meta.status === 'submitted' ||
      meta.status === 'running' ||
      meta.status === 'queued' ||
      meta.status === 'importing'
    ) {
      const ipScanInfo = getState().settings.ipScan;
      // Here we check the status of a job in the interProScan servers

      const { payload, ok } = (await cachedFetchText(
        meta.remoteID
          ? url.resolve(
              url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
              `status/${meta.remoteID || ''}`,
            )
          : null,
        // @ts-expect-error until cached-fetch is migrated
        { useCache: false },
      )) as unknown as { payload: string; ok: boolean };
      const status = payload.toLowerCase().replace('_', ' ') as JobStatus;
      if (ok) {
        // dispatch action to report status in the redux state
        dispatch(updateJob({ metadata: { ...meta, status } }));
        if (status === 'finished') {
          const currentDesc = getState().customLocation.description;
          if (
            currentDesc.main.key !== 'result' ||
            (currentDesc.result.accession &&
              currentDesc.result.accession !== meta.localID &&
              currentDesc.result.accession !== meta.remoteID)
          ) {
            // Sent notification the job is completed/imported
            const notification = createNotification(
              'InterProScan',
              'Your InterProScan search results are ready to view',
            );
            notification.onclick = () => {
              window.open(
                `${window.location.origin}/interpro/result/InterProScan/${
                  meta.remoteID || ''
                }`,
                '_blank',
              );
            };
            dispatch(
              addToast(
                {
                  title: `Job ${status}`,
                  body: `Your job with id ${
                    meta.remoteID || '_'
                  } is in a “${status}” state.`,
                  ttl: 10000, // eslint-disable-line no-magic-numbers
                  link: {
                    to: {
                      description: {
                        main: { key: 'result' },
                        result: {
                          type: 'InterProScan',
                          accession: meta.remoteID,
                        },
                      },
                    },
                    children: 'Go to the result page',
                  },
                },
                id(),
              ) as unknown as UnknownAction,
            );
          }
        }
      }
      // TODO: we need to handle the cases when the response is not OK.
    }
    if (meta.status === 'finished' && !meta.hasResults) {
      const ipScanInfo = getState().settings.ipScan;
      // Getting the results from the interporScan Server
      const { payload: data1, ok } = (await cachedFetchJSON(
        meta.remoteID
          ? url.resolve(
              url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
              `result/${meta.remoteID || ''}/json`,
            )
          : null,
      )) as unknown as { payload: IprscanDataIDB; ok: boolean };
      const { payload: data2, ok: ok2 } = (await cachedFetchXML(
        meta.remoteID
          ? url.resolve(
              url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
              `result/${meta.remoteID || ''}/submission`,
            )
          : null,
      )) as unknown as { payload: ImportedParametersPayload; ok: boolean };
      if (ok && ok2) {
        const data = {
          ...processImportedAttributes(data2),
          ...data1,
        };
        dispatch(
          updateJob({
            metadata: { ...meta, hasResults: true },
            data,
          }),
        );
      } else {
        dispatch(
          updateJob({
            metadata: { ...meta, hasResults: false, status: 'error' },
          }),
        );
      }
    }
  };

  let loopID: number;
  let running = false;
  const loop = async () => {
    if (running) return;
    // This might have been called before the scheduled run, so clear the
    // corresponding scheduled run first
    clearTimeout(loopID);
    running = true;

    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);

    try {
      const metaT = await metaTA;
      for (const [localID, meta] of Object.entries(
        (await metaT.getAll()) as Record<string, MinimalJobMetadata>,
      )) {
        await processJob(localID, meta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      loopID = window.setTimeout(loop, DEFAULT_LOOP_TIMEOUT);
      running = false;
    }
  };

  // start the logic
  rehydrateStoredJobs(dispatch);
  loop();

  return (next) => (tmpAction) => {
    const unknownAction = tmpAction as UnknownAction;
    const previousState = getState();
    const output = next(unknownAction) as GlobalState;
    if (
      unknownAction.type === CREATE_JOB ||
      unknownAction.type === IMPORT_JOB
    ) {
      const action = unknownAction as JobAction;
      const job = getState().jobs[action.job.metadata.localID!];
      createJobInDB(job.metadata, action.job.data);
      if (unknownAction.type === IMPORT_JOB)
        processJob(action.job.metadata.localID!, job.metadata);
    }
    if (unknownAction.type === IMPORT_JOB_FROM_DATA) {
      const action = unknownAction as JobAction;
      const job = getState().jobs[action.job.metadata.localID!];
      const { results, ...jobDataWithoutResults } = action.job.data;
      createJobInDB(
        job.metadata,
        jobDataWithoutResults as unknown as IprscanDataIDB,
      );
      updateJobInDB(job.metadata, action.job.data, dispatch);
    }

    if (unknownAction.type === UPDATE_JOB) {
      const action = unknownAction as JobAction;
      updateJobInDB(
        getState().jobs[action.job.metadata.localID!].metadata,
        action.job.data,
        dispatch,
      );
    }

    if (unknownAction.type === DELETE_JOB) {
      deleteJobInDB((unknownAction as JobAction).job.metadata.localID!);
    }

    if (unknownAction.type === UPDATE_JOB_STATUS) {
      loop();
    }

    if (unknownAction.type === UPDATE_JOB_TITLE) {
      const action = unknownAction as nameAction;
      updateJobTitleDB(action.jobID, action.value || '');
      rehydrateStoredJobs(dispatch);
    }
    if (unknownAction.type === UPDATE_SEQUENCE_JOB_TITLE) {
      const action = unknownAction as nameAction;
      updateSequenceTitleDB(action.jobID, action.value || '');
      rehydrateStoredJobs(dispatch);
    }

    if (unknownAction.type === KEEP_JOB_AS_LOCAL) {
      updateJobInDB({
        ...getState().jobs[(unknownAction as JobAction).localID!].metadata,
        status: 'saved in browser',
      });
    }

    if (unknownAction.type === NEW_PROCESSED_CUSTOM_LOCATION) {
      if (
        !previousState.customLocation.description.result.accession &&
        getState().customLocation.description.result.accession
      ) {
        // load job data
      } else if (
        previousState.customLocation.description.result.accession &&
        getState().customLocation.description.result.accession
      ) {
        // unload data
      }
    }

    return output;
  };
};

export default middleware;
