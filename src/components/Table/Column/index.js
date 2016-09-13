import {PropTypes as T} from 'react';

const Column = () => null;
Column.propTypes = {
  accessKey: T.oneOfType([T.string, T.number]).isRequired,
  name: T.string,
  renderer: T.func,
  children: T.any,
};

export default Column;
