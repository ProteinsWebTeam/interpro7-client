import React, { PureComponent } from 'react';
import T from 'prop-types';

import { get as lodashGet } from 'lodash-es';

const defaultRenderer = (value /*: string | number */) => <div>{value}</div>;

const DURATION = 250;

class Row extends PureComponent {
  static propTypes = {
    row: T.object.isRequired,
    columns: T.array.isRequired,
    extra: T.object,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  // TODO review / fix
  componentDidMount() {
    if (!(this._ref.current && this._ref.current.animate)) return;
    // onenter for this node
    // this._ref.current.animate(
    //   [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}],
    //   {duration: 500, delay: Math.random() * 100, fill: 'both'},
    // );
    this._ref.current.animate(
      { opacity: [0, 1] },
      { duration: DURATION, easing: 'ease-in-out' },
    );
  }

  render() {
    const { row, columns, extra } = this.props;
    return (
      <tr ref={this._ref}>
        {columns
          .filter(({ displayIf = true }) => displayIf)
          .map(
            ({
              dataKey,
              defaultKey,
              cellStyle,
              cellClassName,
              renderer = defaultRenderer,
            }) => (
              <td
                key={defaultKey || dataKey}
                style={cellStyle}
                className={cellClassName}
              >
                {renderer(lodashGet(row, dataKey, '∅'), row, extra)}
              </td>
            ),
          )}
      </tr>
    );
  }
}

export default Row;
