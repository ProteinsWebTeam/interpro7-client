import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';

import Button from 'components/SimpleCommonComponents/Button';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../../style.css';

const css = cssBinder(fonts, local);

function generateSingleIPScanObject(
  job: IprscanMetaIDB,
  jobsData: IprscanDataIDB[],
): Record<string, unknown> {
  const { results: _, ...moreMeta } = jobsData?.[0] || {};

  return {
    ...job,
    ...moreMeta,
    results: jobsData.map((jd) => jd.results?.[0]).filter(Boolean),
  };
}

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
  job: IprscanMetaIDB;
  jobsData?: Array<IprscanDataIDB>;
  dataURL?: string;
};
interface LoadedProps extends Props, LoadDataProps<string> {}

const DownloadAll = ({ job, jobsData, data, dataURL }: LoadedProps) => {
  const handleDownload = async () => {
    if (!jobsData?.length) return;
    downloadFile(
      generateSingleIPScanObject(job, jobsData),
      `${job.remoteID}.json`,
    );
  };
  const remoteID = job.remoteID;
  const thereIsDataInServers = remoteID && data?.payload === 'FINISHED';
  return thereIsDataInServers ? (
    ['sequence', 'tsv', 'json', 'xml', 'gff'].map((type) => {
      const extension = type === 'sequence' ? 'fasta' : type;
      return (
        <li key={type}>
          <Tooltip
            title={
              <div>
                This will download the data that was originally loaded to our
                servers. This is only available for 7 days after running the
                job.
              </div>
            }
          >
            <Link
              target="_blank"
              href={`${dataURL}/${remoteID}/${type}`}
              download={`InterProScan-${remoteID}.${extension}`}
              buttonType="hollow"
              className={css('download-option')}
            >
              <span
                className={css(
                  'icon',
                  'icon-fileformats',
                  `icon-${extension.toUpperCase()}`,
                )}
              />{' '}
              {extension.toUpperCase()}{' '}
              {extension === 'fasta' ? 'input' : 'output'}
            </Link>
          </Tooltip>
        </li>
      );
    })
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
        <Button
          className={css('group, download-option')}
          type="hollow"
          onClick={handleDownload}
          icon="icon-download"
          aria-label="Download group results"
        >
          JSON output
        </Button>
      </Tooltip>
    </li>
  );
};

const getUrlForIpscan = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  (_state: GlobalState, props?: Props) => props?.job?.remoteID || '',
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
} as LoadDataParameters)(DownloadAll);
