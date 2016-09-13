import React, {PropTypes as T} from 'react';

const defaultRenderer = (value/*: string | number */) => (
  <div>{value}</div>
);

const Row = ({row, columns}/*: {row: Object, columns: Array<Object>}*/) => (
  <tr>
    {columns.map(({accessKey, renderer = defaultRenderer}) => (
      <td
        key={accessKey}
        style={{width: accessKey === 'length' ? '100%' : 'auto'}}
      >
        {renderer(row[accessKey], row)}
      </td>
    ))}
  </tr>
);
Row.propTypes = {
  row: T.object.isRequired,
  columns: T.array.isRequired,
};

export default Row;
