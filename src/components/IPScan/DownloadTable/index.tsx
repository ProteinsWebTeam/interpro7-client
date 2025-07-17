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

type ReleasePayload = Array<{
  tag_name: string;
}>;

interface LoadedProps
  extends LoadDataProps<ReleasePayload, 'IPScan'>,
    LoadDataProps<ReleasePayload, 'IPScan6'> {}

export const DownloadTable = ({ dataIPScan, dataIPScan6 }: LoadedProps) => {
  if (!dataIPScan || !dataIPScan6) return null;
  if (dataIPScan?.loading || dataIPScan6?.loading) return <Loading />;

  const version = dataIPScan.payload?.[0].tag_name;
  const version6 = dataIPScan6.payload?.[0].tag_name;

  //const [_, dataVersion] = version.split('-');

  return (
    <>
      <h4> InterProScan 5 </h4>
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
            <td>Binaries and data</td>
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
        </tbody>
      </table>

      <p className={css('small', 'margin-top-small')}>
        To ensure you have the latest data and software enhancements we always
        recommend you download the latest version of InterProScan. However, all
        previous releases are archived on the{' '}
        <Link href="https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/">
          FTP site
        </Link>
        .<br />
        InterProScan&#39;s source code is available on{' '}
        <Link
          href="//github.com/ebi-pf-team/interproscan"
          className={css('ext')}
          target="_blank"
        >
          Github
        </Link>
        .
      </p>

      <h4> InterProScan 6 </h4>
      <p> The latest version of InterProScan6 is {version6}. </p>
      <p>
        To get started, install Nextflow (version 24.10.04 or later) along with
        a container runtime such as Docker, SingularityCE, or Apptainer.
        Nextflow will automatically retrieve the workflow from GitHub, and
        required data can be downloaded during execution.
      </p>
      <p>
        If you have Docker and Nextflow installed, run the following command to
        test InterProScan and download required data:
      </p>
      <p>
        <pre>
          <code>
            nextflow run ebi-pf-team/interproscan6 <br /> -r {version6} <br />{' '}
            -profile docker,test <br /> --datadir data <br /> --interpro latest{' '}
          </code>
        </pre>
      </p>
      <p>
        You will find more examples and documentation on{' '}
        <a
          href="https://github.com/ebi-pf-team/interproscan6"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </>
  );
};

export default loadData<ReleasePayload, 'IPScan'>({
  getUrl: getUrlForRelease('IPScan'),
  propNamespace: 'IPScan',
} as LoadDataParameters)(
  loadData<ReleasePayload, 'IPScan6'>({
    getUrl: getUrlForRelease('IPScan6'),
    propNamespace: 'IPScan6',
  } as LoadDataParameters)(DownloadTable),
);
