import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { SearchBox } from 'components/Table';
import ColumnSelectMenu from './ColumnSelectMenu';

export type CustomiseSearchBoxOptions = {
  type?: string;
  validation?: RegExp;
  message?: string;
  placeholder?: string;
};
type Props = {
  field: string;
  forceToShow?: boolean;
  search: InterProLocationSearch;
  showOptions?: boolean;
  options?: Array<string>;
  customiseSearch?: CustomiseSearchBoxOptions;
};
const ColumnSearchBox = ({
  field,
  forceToShow,
  search,
  showOptions,
  options,
  customiseSearch,
}: Props) => {
  if (!forceToShow && !(field in search)) return null;
  if (showOptions && options)
    return <ColumnSelectMenu field={field} options={options} />;
  return (
    <SearchBox field={field} customiseSearch={customiseSearch}>
      {customiseSearch?.placeholder}
    </SearchBox>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (description, search) => ({ description, search }),
);

export default connect(mapStateToProps)(ColumnSearchBox);
