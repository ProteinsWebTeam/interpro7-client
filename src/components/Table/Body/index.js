// @flow
import React from 'react';
import T from 'prop-types';

import Row from '../Row';

import { foundationPartial } from 'styles/foundation';
import styles from '../style.css';

const f = foundationPartial(styles);

export const Body = (
  {
    rows,
    columns,
    notFound,
  } /*: {rows: Array<Object>, columns: Array<Object>}*/,
) => {
  if (notFound || !rows.length) {
    return (
      <tbody>
        <tr>
          <td
            className={f('padding-top-large', 'padding-bottom-large')}
            colSpan="999"
          >
            <span className={f('warning-msg-table')}>No data available</span>
          </td>
        </tr>
      </tbody>
    );
  }
  return (
    <tbody>
      {rows.map((row, i) => {
        const rowData = row.metadata || row;
        return (
          <Row key={rowData.accession || i} row={rowData} columns={columns} />
        );
      })}
    </tbody>
  );
};
Body.propTypes = {
  rows: T.array.isRequired,
  columns: T.array.isRequired,
  notFound: T.bool,
};

export default Body;
