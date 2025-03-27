import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import cssBinder from 'styles/cssBinder';

import Link from 'components/generic/Link';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import styles from './style.css';

const css = cssBinder(styles);

const mapEndpointToName = new Map([
  ['api', 'InterPro API'],
  ['ebi', 'EBI Search API'],
  ['ipScan', 'InterProScan API'],
  ['wikipedia', 'Wikipedia API'],
  ['alphafold', 'AlphaFold API'],
  ['bfvd', 'BFVD API'],
]);

type BrowserProps = {
  status: boolean;
};

const BrowserStatus = ({ status }: BrowserProps) => {
  return (
    <Tooltip title={`You browser appears to be ${status ? 'on' : 'off'}line`}>
      <span
        className={css('status-light', 'browser-light', {
          online: status,
          offline: !status,
        })}
      />
    </Tooltip>
  );
};

type ServerProps = ServerStatus & {
  browser: boolean;
  endpoint: string;
};

const ServerStatus = ({
  browser,
  endpoint,
  status,
  lastCheck,
}: ServerProps) => {
  return (
    <Tooltip
      html={
        <span>
          {`${mapEndpointToName.get(endpoint)} appears ${
            status ? 'on' : 'off'
          }line. Last checked `}
          {lastCheck && <TimeAgo date={new Date(lastCheck)} />}
        </span>
      }
    >
      <span
        className={css('status-light', {
          ['browser-offline']: !browser,
          online: status === true,
          offline: status === false,
        })}
      />
    </Tooltip>
  );
};

type StatusesProps = {
  statuses: Record<string, ServerStatus>;
  browser: boolean;
};

const ServerStatuses = ({ statuses, browser }: StatusesProps) => {
  return (
    <Link to={{ description: { other: ['settings'] } }}>
      <ul className={css('connection-statuses')}>
        <li>
          <BrowserStatus status={browser} />
        </li>
        {Object.entries(statuses).map(([endpoint, status]) => (
          <li key={endpoint}>
            <ServerStatus endpoint={endpoint} {...status} browser={browser} />
          </li>
        ))}
      </ul>
    </Link>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.status.servers,
  (state: GlobalState) => state.status.browser,
  (statuses, browser) => ({ statuses, browser }),
);

export default connect(mapStateToProps)(ServerStatuses);
