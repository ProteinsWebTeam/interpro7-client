// @flow
import React from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import style from './style.css';

import loadData from 'higherOrder/loadData';
import { getUrlForRelease } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';
import fonts from 'EBI-Icon-fonts/fonts.css';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

const f = foundationPartial(ipro, style, fonts);

const parseBody = (text) =>
  text
    .trim()
    .split('\n')
    .reduce((agg, line) => {
      const [k, v] = line.split(':');
      agg[k] = v;
      return agg;
    }, {});

export const InterProScan = (
  {
    data: { loading, payload },
  } /*: {data: {loading: boolean, payload: ?Object}}*/,
) => {
  if (loading || !payload) return <Loading />;
  const { tag_name: version, body } = payload;
  const metadata = parseBody(body);
  return (
    <section>
      <h4>
        Download the latest version <small>({version})</small>
      </h4>
      <div>
        <span className={f('icon', 'icon-common')} data-icon="&#xf17c;" /> Linux
        (64-bit) -{' '}
        <Tooltip
          title={`
              <b>Software</b>:<br/>
              <ul>
                <li>Linux 64-bit</li>
                <li>Perl 5</li>
                <li>Python 3</li>
                <li>Java 8</li>
              </ul>`}
          style={{ textDecoration: 'underline', cursor: 'help' }}
        >
          System requirements
        </Tooltip>
        <br />
        <small>
          <ul>
            <li>
              There are no versions planned for Windows or Apple operating
              systems. This is due to constraints in the various third-party
              binaries that InterProScan runs.
            </li>

            <li>
              Older versions of InterProScan are not supported anymore. We
              highly recommend you to update to the latest version.
            </li>
          </ul>
        </small>
      </div>
      <div className={f('download', 'flex-card')}>
        <Link
          className={f('button')}
          href={`http://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
          target="_blank"
        >
          Download InterProScan
        </Link>
        {metadata.size && (
          <div className={f('metadata')}>
            Version {version} - {metadata.CPU} {metadata.OS} - {metadata.size}
          </div>
        )}
        {metadata.MD5 && (
          <div className={f('metadata')}>MD5: {metadata.MD5}</div>
        )}
      </div>
    </section>
  );
};
InterProScan.propTypes = {
  data: dataPropType,
};

export default loadData(getUrlForRelease('IPScan'))(InterProScan);
