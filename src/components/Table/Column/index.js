import T from 'prop-types';

const Column = () => null;
Column.propTypes = {
  dataKey: T.oneOfType([T.string, T.number]).isRequired,
  defaultKey: T.oneOfType([T.string, T.number]),
  name: T.string,
  renderer: T.func,
  displayIf: T.bool,
  headerStyle: T.object,
  cellStyle: T.object,
  className: T.string,
  children: T.any,
};

export default Column;
