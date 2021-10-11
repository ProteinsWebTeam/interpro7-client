// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Loading from 'components/SimpleCommonComponents/Loading';

import Row from '../Row';

import { edgeCases } from 'utils/server-message';
import EdgeCase from 'components/EdgeCase';

import ColorHash from 'color-hash';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);
// default values for version 1.X of colorhash
const colorHash = new ColorHash({
  hash: 'bkdr',
  saturation: [0.65, 0.35, 0.5],
  lightness: 0.95,
});

/*:: type Props = { children: any} */

class NoRows extends PureComponent /*:: <Props> */ {
  /*:: _ref: { current: null | React$ElementRef<'tbody'> }; */
  static propTypes = {
    children: T.any.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    if (!(this._ref.current && this._ref.current.animate)) return;
    this._ref.current.animate(
      { opacity: ([0, 1] /*: Array<number|null> */) },
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
/*:: type BodyProps = {
  loading: boolean,
  ok: boolean,
  status: number,
  rows: Array<Object>,
  rowKey: string,
  columns: Array<string>,
  rowClassName:string | function,
  groups?: Array<string>,
  notFound: boolean
} */

class Body extends PureComponent /*:: <BodyProps> */ {
  static propTypes = {
    loading: T.bool,
    ok: T.bool,
    status: T.number,
    rows: T.array.isRequired,
    rowKey: T.string,
    columns: T.array.isRequired,
    notFound: T.bool,
    rowClassName: T.oneOfType([T.string, T.func]),
    groups: T.arrayOf(T.string),
  };

  static defaultProps = {
    rowKey: 'accession',
  };

  render() {
    const {
      loading,
      ok,
      status,
      rows,
      rowKey,
      columns,
      notFound,
      rowClassName,
      groups,
    } = this.props;
    const edgeCaseText = edgeCases.get(status);
    if (edgeCaseText)
      return (
        <NoRows>
          <EdgeCase
            text={edgeCaseText}
            status={status}
            shouldRedirect={false}
          />
        </NoRows>
      );

    // const message = getStatusMessage(status);
    // if (message) return <NoRows>{message}</NoRows>;
    // don't change next line to “!ok”, might be undefined
    if (ok === false) return <NoRows>The API request failed</NoRows>;
    if (notFound || !rows.length) {
      return <NoRows>{loading ? <Loading /> : 'No data available'}</NoRows>;
    }
    let curentGroup = null;
    return (
      <tbody>
        {rows.map((row, index) => {
          const rowData = row.metadata || row;
          const extraData = row.extra_fields;
          const rcn = row.className ? row.className : rowClassName;
          const shouldRenderGroupHeader =
            groups?.length && row.group && curentGroup !== row.group;
          if (shouldRenderGroupHeader) {
            curentGroup = row.group;
          }
          return (
            <React.Fragment key={rowData[rowKey] || index}>
              {shouldRenderGroupHeader && (
                <tr>
                  <th
                    style={{
                      textAlign: 'start',
                      backgroundColor: colorHash.hex(row.group),
                    }}
                  >
                    {row.group}
                  </th>
                </tr>
              )}
              <Row
                row={rowData}
                columns={columns}
                extra={extraData}
                rowClassName={rcn}
                group={groups && row.group}
                backgroundColor={
                  groups && row.group ? colorHash.hex(row.group) : null
                }
              />
            </React.Fragment>
          );
        })}
      </tbody>
    );
  }
}

export default Body;
