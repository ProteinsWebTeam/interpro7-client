import React, { Component } from 'react';
import T from 'prop-types';

import lodashGet from 'lodash-es/get';

const defaultRenderer = (value /*: string | number */) =>
  <div>
    {value}
  </div>;

const Row = class extends Component {
  static propTypes = {
    row: T.object.isRequired,
    columns: T.array.isRequired,
  };

  componentDidMount() {
    if (!this._node.animate) return;
    // onenter for this node
    // this._node.animate(
    //   [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}],
    //   {duration: 500, delay: Math.random() * 100, fill: 'both'},
    // );
    this._node.animate(
      { opacity: [0, 1] },
      { duration: 1000, easing: 'ease-in-out' },
    );
  }

  render() {
    const { row, columns } = this.props;
    return (
      <tr ref={node => (this._node = node)}>
        {columns.map(
          ({ accessKey, defaultKey, cellStyle, renderer = defaultRenderer }) =>
            <td key={defaultKey || accessKey} style={cellStyle}>
              {renderer(lodashGet(row, accessKey, '∅'), row)}
            </td>,
        )}
      </tr>
    );
  }
};

export default Row;
