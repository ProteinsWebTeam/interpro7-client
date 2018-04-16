import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import cn from 'classnames/bind';

import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import styles from './style.css';

const s = cn.bind(styles);

const mapEndpointToName = new Map([
  ['api', 'InterPro API'],
  ['ebi', 'EBI Search API'],
  ['ipScan', 'InterProScan API'],
]);

class BrowserStatus extends PureComponent {
  static propTypes = {
    status: T.bool.isRequired,
  };

  render() {
    const { status } = this.props;
    return (
      <Tooltip title={`You browser appears to be ${status ? 'on' : 'off'}line`}>
        <span
          className={s('status-light', 'browser-light', {
            online: status,
            offline: !status,
          })}
        />
      </Tooltip>
    );
  }
}

class ServerStatus extends PureComponent {
  static propTypes = {
    browser: T.bool.isRequired,
    endpoint: T.string.isRequired,
    status: T.bool,
    lastCheck: T.number,
  };

  render() {
    const { browser, endpoint, status, lastCheck } = this.props;
    return (
      <Tooltip
        useContext
        html={
          <span>
            {`${mapEndpointToName.get(endpoint)} appears ${
              status ? 'on' : 'off'
            }line. Last checked `}
            <TimeAgo date={new Date(lastCheck)} />
          </span>
        }
      >
        <span
          className={s('status-light', {
            ['browser-offline']: !browser,
            online: status === true,
            offline: status === false,
          })}
        />
      </Tooltip>
    );
  }
}

class _ServerStatuses extends PureComponent {
  static propTypes = {
    statuses: T.object.isRequired,
    browser: T.bool.isRequired,
  };

  render() {
    const { statuses, browser } = this.props;
    return (
      <ul className={styles['connection-statuses']}>
        <BrowserStatus status={browser} />
        {Object.entries(statuses).map(([endpoint, status]) => (
          <li key={endpoint}>
            <ServerStatus endpoint={endpoint} {...status} browser={browser} />
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.status.servers,
  state => state.status.browser,
  (statuses, browser) => ({ statuses, browser }),
);

export default connect(mapStateToProps)(_ServerStatuses);
