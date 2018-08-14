import React, { PureComponent } from 'react';
import T from 'prop-types';

import Loading from 'components/SimpleCommonComponents/Loading';

import Row from '../Row';

import getStatusMessage from 'utils/server-message';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

class NoRows extends PureComponent {
  static propTypes = {
    children: T.any.isRequired,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    if (!(this._ref.current && this._ref.current.animate)) return;
    this._ref.current.animate(
      { opacity: [0, 1] },
      { duration: 500, delay: 500, easing: 'ease-in-out', fill: 'both' },
    );
  }

  render() {
    return (
      <tbody ref={this._ref}>
        <tr>
          <td
            className={f('padding-top-large', 'padding-bottom-large')}
            colSpan="999"
          >
            <span className={f('warning-msg-table')}>
              {this.props.children}
            </span>
          </td>
        </tr>
      </tbody>
    );
  }
}

class Body extends PureComponent {
  static propTypes = {
    loading: T.bool,
    ok: T.bool,
    status: T.number,
    rows: T.array.isRequired,
    columns: T.array.isRequired,
    notFound: T.bool,
  };

  render() {
    const { loading, ok, status, rows, columns, notFound } = this.props;
    const message = getStatusMessage(status);
    if (message) return <NoRows>{message}</NoRows>;
    // don't change next line to “!ok”, might be undefined
    if (ok === false) return <NoRows>The API request failed</NoRows>;
    if (notFound || !rows.length) {
      return <NoRows>{loading ? <Loading /> : 'No data available'}</NoRows>;
    }
    return (
      <tbody>
        {rows.map((row, index) => {
          const rowData = row.metadata || row;
          const extraData = row.extra_fields;
          return (
            <Row
              key={rowData.accession || index}
              row={rowData}
              columns={columns}
              extra={extraData}
            />
          );
        })}
      </tbody>
    );
  }
}

export default Body;
