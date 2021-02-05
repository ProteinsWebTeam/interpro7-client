// @flow
import T from 'prop-types';

const Column = ({ ..._ /*: Array<any> */ }) => null;
Column.propTypes = {
  dataKey: T.oneOfType([T.string, T.number]).isRequired,
  defaultKey: T.oneOfType([T.string, T.number]),
  name: T.string,
  renderer: T.func,
  displayIf: T.bool,
  headerStyle: T.object,
  cellStyle: T.object,
  headerClassName: T.string,
  cellClassName: T.string,
  isSearchable: T.bool,
  children: T.any,
  showOptions: T.bool,
  options: T.array,
  customiseSearch: T.object,
};

export default Column;
