import React from 'react';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForRelease } from 'higherOrder/loadData/defaults';

import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import tableCSS from 'components/Table/style.css';

const css = cssBinder(tableCSS, fonts, local);

interface LoadedProps extends LoadDataProps<{ tag_name: string }> {}

export const DownloadTable = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading || !payload) return <Loading />;
  const { tag_name: version } = payload;
  const [_, dataVersion] = version.split('-');

  return (
    <table className={css('vf-table')}>
      <thead>
        <tr>
          <th>Resource</th>
          <th>Version</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>InterProScan (64-bit Linux)</td>
          <td>{version}</td>
          <td>
            <Link
              href={`https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
            >
              tar
            </Link>
            ,{' '}
            <Link
              href={`https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz.md5`}
            >
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>InterProScan</td>
          <td>6.0.0-alpha</td>
          <td>
            <p>
              To get started, install <strong>Nextflow</strong> (version
              24.10.04 or later) along with a container runtime such as Docker,
              SingularityCE, or Apptainer. Nextflow will automatically retrieve
              the workflow from GitHub, and required data can be downloaded
              during execution.
            </p>
            <p>
              If you have Docker and Nextflow installed, run the following
              command to test InterProScan and download required data:
            </p>
            <pre>
              <code>
                nextflow run ebi-pf-team/interproscan6 <br /> -r 6.0.0-alpha{' '}
                <br /> -profile docker,test <br /> --datadir data <br />{' '}
                --interpro latest <br /> --download
              </code>
            </pre>
            <p>
              For more information, refer to the official guide on{' '}
              <a
                href="https://github.com/ebi-pf-team/interproscan6"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default loadData(getUrlForRelease('IPScan') as LoadDataParameters)(
  DownloadTable,
);
