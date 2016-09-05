import React, {PropTypes as T} from 'react';

import ObjectList from '../ObjectList';

const List = ({data}) => (
  <div>
    <h2>data dump in list:</h2>
    <ul>
      {data.map((datum, i) => (
        <li key={i}>
          <ObjectList object={datum} />
        </li>
      ))}
    </ul>
  </div>
);

List.propTypes = {
  data: T.array.isRequired,
};

export default List;
