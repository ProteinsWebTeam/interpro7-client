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
          <th className={css('min-width-sm')}>Name</th>
          <th>Description</th>
          <th>Data</th>
          <th className={css('xs-hide')}>File name</th>
          <th className={css('xs-hide')}>Format</th>
          <th className={css('xs-hide')}>Links</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              href={`http://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
              target="_blank"
              style={{ whiteSpace: 'nowrap' }}
            >
              InterProScan {version}
            </Link>
          </td>
          <td>
            Download and install the latest version of InterProScan (64-bit
            Linux)
          </td>
          <td>v{dataVersion}</td>
          <td className={css('xs-hide')}>
            interproscan-{version}-64-bit.tar.gz
          </td>
          <td className={css('xs-hide')}>gzipped</td>
          <td>
            <Link
              href={`http://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
              target="_blank"
            >
              <span
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default loadData(getUrlForRelease('IPScan') as LoadDataParameters)(
  DownloadTable,
);
