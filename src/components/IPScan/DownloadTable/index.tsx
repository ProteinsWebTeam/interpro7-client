import React from 'react';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForRelease } from 'higherOrder/loadData/defaults';

import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import tableCSS from 'components/Table/style.css';

const css = cssBinder(tableCSS, fonts);

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
      </tbody>
    </table>
  );
};

export default loadData(getUrlForRelease('IPScan') as LoadDataParameters)(
  DownloadTable,
);
