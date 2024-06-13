import React, { PureComponent, ReactNode, RefObject } from 'react';

import { get as lodashGet } from 'lodash-es';
import { ColumnProps, Renderer } from '../Column';

const defaultRenderer: Renderer = (value) => <div>{String(value)}</div>;

const DURATION = 250;

type Props = {
  row: Record<string, unknown>;
  columns: Array<ColumnProps>;
  extra: Record<string, unknown>;
  rowClassName: string | ((rowData: unknown) => string);
  group?: string;
  backgroundColor?: string;
};
class Row extends PureComponent<Props> {
  _ref: RefObject<HTMLTableRowElement>;

  constructor(props: Props) {
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
                renderer = defaultRenderer,
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
