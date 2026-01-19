import React, { PureComponent, RefObject } from 'react';

import { get as lodashGet } from 'lodash-es';
import { ColumnProps, Renderer } from '../Column';

const defaultRenderer: Renderer = (value) => {
  if (value) return <div>{value as string}</div>;
  return null;
};

const DURATION = 250;

type Props<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = {
  row: RowData;
  columns: Array<ColumnProps<unknown, RowData, ExtraData>>;
  extra?: ExtraData;
  rowClassName?: string | ((rowData: RowData) => string);
  group?: string;
  backgroundColor?: string;
};
class Row<
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> extends PureComponent<Props<RowData, ExtraData>> {
  _ref: RefObject<HTMLTableRowElement>;

  constructor(props: Props<RowData, ExtraData>) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    if (!(this._ref.current && this._ref.current.animate)) return;
    this._ref.current.animate(
      { opacity: [0, 1] },
      { duration: DURATION, easing: 'ease-in-out' },
    );
  }

  render() {
    const { row, columns, extra, rowClassName, group, backgroundColor } =
      this.props;
    const rcn =
      typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
    return (
      <tr ref={this._ref} className={rcn}>
        {columns
          .filter(({ displayIf = true }) => displayIf)
          .map(
            (
              {
                dataKey,
                defaultKey,
                cellStyle,
                cellClassName,
                renderer = defaultRenderer as Renderer<
                  unknown,
                  RowData,
                  ExtraData
                >,
              },
              i,
            ) => (
              <td
                key={defaultKey || dataKey}
                style={{
                  backgroundColor,
                  ...(cellStyle || {}),
                }}
                className={cellClassName}
                data-testid="table-entity"
              >
                {group && i === 0 ? (
                  <div style={{ display: 'flex' }}>
                    <span>&emsp;</span>
                    {renderer(lodashGet(row, dataKey, '∅'), row, extra)}
                  </div>
                ) : (
                  renderer(lodashGet(row, dataKey, '∅'), row, extra)
                )}
              </td>
            ),
          )}
      </tr>
    );
  }
}

export default Row;
