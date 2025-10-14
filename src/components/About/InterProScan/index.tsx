import React from 'react';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData/ts';

import { getUrlForRelease } from 'higherOrder/loadData/defaults';

import Loading from 'components/SimpleCommonComponents/Loading';
import Card from 'components/SimpleCommonComponents/Card';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = cssBinder(style, fonts);

const parseBody = (text: string) =>
  text
    .trim()
    .split('\n')
    .reduce(
      (agg, line: string) => {
        const [k, v] = line.split(':');
        agg[k] = v;
        return agg;
      },
      {} as Record<string, string>,
    );

interface LoadedProps
  extends LoadDataProps<
    Array<{
      tag_name: string;
      body: string;
    }>
  > {}

export const InterProScan = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading || !payload || payload.length === 0) return <Loading />;
  const { tag_name: version, body } = payload[0];
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
      <Card>
        <div className={f('download')}>
          <Link
            className={f('button')}
            href={`https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/${version}/interproscan-${version}-64-bit.tar.gz`}
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
      </Card>
    </section>
  );
};

export default loadData(getUrlForRelease('IPScan') as LoadDataParameters)(
  InterProScan,
);
