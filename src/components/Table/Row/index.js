import React, { Component } from 'react';
import T from 'prop-types';

import lodashGet from 'lodash-es/get';

const defaultRenderer = (value /*: string | number */) => <div>{value}</div>;

class Row extends Component {
  static propTypes = {
    row: T.object.isRequired,
    columns: T.array.isRequired,
  };
  // TODO review / fix
  // componentDidMount() {
  //   if (!this._node.animate) return;
  //   // onenter for this node
  //   // this._node.animate(
  //   //   [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}],
  //   //   {duration: 500, delay: Math.random() * 100, fill: 'both'},
  //   // );
  //   this._node.animate(
  //     { opacity: [0, 1] },
  //     { duration: 1000, easing: 'ease-in-out' }
  //   );
  // }

  render() {
    const { row, columns } = this.props;
    return (
      <tr ref={node => (this._node = node)}>
        {columns
          .filter(({ displayIf = true }) => displayIf)
          .map(
            ({
              dataKey,
              defaultKey,
              cellStyle,
              className,
              renderer = defaultRenderer,
            }) => (
              <td
                key={defaultKey || dataKey}
                style={cellStyle}
                className={className}
              >
                {renderer(lodashGet(row, dataKey, '∅'), row)}
              </td>
            ),
          )}
      </tr>
    );
  }
}

export default Row;
