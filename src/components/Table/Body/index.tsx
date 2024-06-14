import React, { PropsWithChildren, PureComponent, RefObject } from 'react';
import ColorHash from 'color-hash';

import Loading from 'components/SimpleCommonComponents/Loading';

import Row from '../Row';

import { edgeCases } from 'utils/server-message';
import EdgeCase from 'components/EdgeCase';

import cssBinder from 'styles/cssBinder';

import tableStyles from '../style.css';
import styles from './style.css';
import { ColumnProps } from '../Column';

const css = cssBinder(styles, tableStyles);
// default values for version 1.X of colorhash
/* eslint-disable no-magic-numbers */
const colorHash = new ColorHash({
  saturation: [0.65, 0.35, 0.5],
  lightness: 0.95,
});
/* eslint-enable no-magic-numbers */

type Props = PropsWithChildren<{}>;

class NoRows extends PureComponent<Props> {
  _ref: RefObject<HTMLTableSectionElement>;

  constructor(props: Props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    // $FlowFixMe method-unbinding
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
            className={css('padding-top-large', 'padding-bottom-large')}
            colSpan={999}
          >
            <span className={css('warning-msg-table')}>
              {this.props.children}
            </span>
          </td>
        </tr>
      </tbody>
    );
  }
}
type BodyProps<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = {
  loading: boolean;
  ok: boolean;
  status: number;
  rows: Array<
    (RowData | { metadata: RowData }) & {
      extra_fields?: ExtraData;
      group?: string;
    }
  >;
  rowKey: string;
  columns: Array<ColumnProps<unknown, RowData, ExtraData>>;
  rowClassName: string | ((rowData: RowData) => string);
  groups?: Array<string>;
  groupActions?: React.FC<{ group: string }>;
  notFound: boolean;
};

class Body<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> extends PureComponent<BodyProps<RowData, ExtraData>> {
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
      groupActions,
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
    let curentGroup: string | null = null;
    return (
      <tbody>
        {rows.map((row, index) => {
          const rowData = 'metadata' in row ? row.metadata : row;
          const extraData =
            'extra_fields' in row ? row.extra_fields : undefined;
          const rcn =
            'className' in row ? (row.className as string) : rowClassName;
          let GroupActions: React.FC<{ group: string }> | null = null;
          const rowGroup = 'group' in row ? (row.group as string) : undefined;
          const shouldRenderGroupHeader = !!(
            groups?.length &&
            rowGroup &&
            curentGroup !== rowGroup
          );
          if (shouldRenderGroupHeader && groupActions) {
            curentGroup = rowGroup as string;
            GroupActions = groupActions;
          }
          return (
            <React.Fragment
              key={
                rowKey in (rowData as object)
                  ? (rowData as Record<string, string>)[rowKey]
                  : index
              }
            >
              {shouldRenderGroupHeader && (
                <tr>
                  <th
                    style={{
                      color: 'var(--colors-progress, #1f6ca2)',
                      textAlign: 'start',
                      backgroundColor: colorHash.hex(rowGroup),
                      position: 'unset',
                    }}
                  >
                    {rowGroup}
                  </th>
                  {!!GroupActions && (
                    <>
                      {columns.slice(2).map((_, i) => (
                        <th key={i} style={{ position: 'unset' }} />
                      ))}
                      <th
                        style={{ position: 'unset' }}
                        className={css('table-header-right')}
                      >
                        <GroupActions group={rowGroup} />
                      </th>
                    </>
                  )}
                </tr>
              )}
              <Row
                row={rowData}
                columns={columns}
                extra={extraData}
                rowClassName={rcn}
                group={groups && (row.group as string)}
                backgroundColor={
                  groups && row.group
                    ? colorHash.hex(row.group as string)
                    : undefined
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
