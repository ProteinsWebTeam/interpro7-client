import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import { getAllResults, Jobs } from '..';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../../style.css';

const css = cssBinder(fonts, local);

const downloadFile = (jsonContent: Record<string, unknown>, name: string) => {
  const downloadContent = JSON.stringify(jsonContent);
  const blob = new Blob([downloadContent], { type: 'application/json' });

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.download = name;

  document.body?.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode?.removeChild(link);
  }, 0);
};

type Props = {
  jobs: Jobs;
  remoteID?: string;
  group: string;
  dataURL?: string;
};
interface LoadedProps extends Props, LoadDataProps<string> {}

const DownloadAll = ({ jobs, group, remoteID, data, dataURL }: LoadedProps) => {
  const handleDownload = async () => {
    downloadFile(await getAllResults(jobs, group), `${group}.json`);
  };
  const thereDataInServers = remoteID && data?.payload === 'FINISHED';
  return thereDataInServers ? (
    ['tsv', 'json', 'xml', 'gff', 'sequence'].map((type) => (
      <li key={type}>
        <Tooltip
          title={
            <div>
              This will download the data that was originally loaded to our
              servers. This is only available for 7 days after runnin the job.
            </div>
          }
        >
          <Link
            target="_blank"
            href={`${dataURL}/${remoteID}/${type}`}
            download={`InterProScan-${remoteID}.${type}`}
            className={css('group')}
          >
            <span className={css('icon', 'icon-common')} data-icon="&#xf019;" />{' '}
            Download All [{type.toUpperCase()}]
          </Link>
        </Tooltip>
      </li>
    ))
  ) : (
    <li>
      <Tooltip
        title={
          <div>
            This will create a single JSON file with all the{' '}
            <b>locally saved</b> results of this group
          </div>
        }
      >
        <button
          className={css('icon', 'icon-common', 'ico-neutral', 'group')}
          onClick={handleDownload}
          data-icon="&#xf019;"
          aria-label="Download group results"
        >
          {' '}
          Download All [JSON]
        </button>
      </Tooltip>
    </li>
  );
};

const getUrlForIpscan = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  (_state: GlobalState, props?: Props) => props?.remoteID || '',
  (server: ParsedURLServer, remoteID: string) => {
    if (!remoteID) return null;
    const { protocol, hostname, port, root } = server;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}/status/${remoteID}`,
    });
  },
);
const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  ({ protocol, hostname, root }) => ({
    dataURL: `${protocol}//${hostname}${root}result`,
  }),
);

export default loadData({
  getUrl: getUrlForIpscan,
  mapStateToProps,
  fetchOptions: { useCache: false, responseType: 'text' },
} as Params)(DownloadAll);
