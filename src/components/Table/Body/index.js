import React, {PropTypes as T} from 'react';

import Row from '../Row';

export const Body = (
  {rows, columns}/*: {rows: Array<Object>, columns: Array<Object>}*/
) => (
  <tbody>
  {
    rows.map((row, i) => {
      const rowData = row.metadata || row;
      return (
        <Row key={rowData.accession || i} row={rowData} columns={columns} />
      );
    })
  }
  </tbody>
);
Body.propTypes = {
  rows: T.array.isRequired,
  columns: T.array.isRequired,
};

export default Body;
