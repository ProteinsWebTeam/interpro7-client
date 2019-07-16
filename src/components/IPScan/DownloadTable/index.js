// @flow
import React from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import loadData from 'higherOrder/loadData';
import { getUrlForRelease } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

export const DownloadTable = (
  {
    data: { loading, payload },
  } /*: {data: {loading: boolean, payload: ?Object}}*/,
) => {
  if (loading || !payload) return <Loading />;
  const { tag_name: version } = payload;
  const [_, dataVersion] = version.split('-');

  return (
    <table className={f('classic')}>
      <thead>
        <tr>
          <th className={f('min-width-sm')}>Name</th>
          <th>Description</th>
          <th>Data</th>
          <th className={f('xs-hide')}>File name</th>
          <th className={f('xs-hide')}>Format</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              href={`ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
              target="_blank"
            >
              InterProScan {version}
            </Link>
          </td>
          <td>
            Download and install the latest version of InterProScan (64-bit
            Linux)
          </td>
          <td>v{dataVersion}</td>
          <td className={f('xs-hide')}>interproscan-{version}-64-bit.tar.gz</td>
          <td className={f('xs-hide')}>gzipped</td>
          <td>
            <Link
              href={`ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
              target="_blank"
            >
              {' '}
              <span
                className={f('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />{' '}
              64-bit
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
DownloadTable.propTypes = {
  data: dataPropType,
};

export default loadData(getUrlForRelease('IPScan'))(DownloadTable);
