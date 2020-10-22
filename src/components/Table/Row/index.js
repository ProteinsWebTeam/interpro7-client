// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { get as lodashGet } from 'lodash-es';

/*::
  type Renderer = (string | number, ...rest:Array<any>)=> any
 */
const defaultRenderer /*: Renderer */ = (value) => <div>{value}</div>;

const DURATION = 250;

/*:: type Props = {
  row: Object,
  columns: Array<Object>,
  extra: Object,
  rowClassName:string | function
}; */
class Row extends PureComponent /*:: <Props> */ {
  /*:: _ref: {current: null | React$ElementRef<string>} */
  static propTypes = {
    row: T.object.isRequired,
    columns: T.array.isRequired,
    extra: T.object,
    rowClassName: T.oneOfType([T.string, T.func]),
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  // TODO review / fix
  componentDidMount() {
    if (!(this._ref.current && this._ref.current.animate)) return;
    this._ref.current.animate(
      // prettier-ignore
      { opacity: ([0, 1]/*: Array<number | null> */) },
      { duration: DURATION, easing: 'ease-in-out' },
    );
  }

  render() {
    const { row, columns, extra, rowClassName } = this.props;
    const rcn =
      typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;
    return (
      <tr ref={this._ref} className={rcn}>
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
                data-testid="table-entity"
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
