import React, { FormEvent, useImperativeHandle } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import Button from 'components/SimpleCommonComponents/Button';

const NUMBER_OF_SORT_MODES = 3;
const SORT_OFF = 0;
const SORT_UP = 1;
const SORT_DOWN = 2;

const OPACITY_OFF = 0.4;
type Props = { mode: number; onClick: (event: FormEvent) => void };
export const SortButton = ({ mode, onClick }: Props) => {
  let iconClass = 'icon-sort';
  if (SORT_UP === mode) {
    iconClass = 'icon-sort-up';
  }
  if (SORT_DOWN === mode) {
    iconClass = 'icon-sort-down';
  }
  return (
    <Button
      type="inline"
      style={{
        opacity: mode === SORT_OFF ? OPACITY_OFF : 1,
      }}
      onClick={onClick}
      icon={iconClass}
    />
  );
};

export type ExposedButtonProps = {
  toggleSort: () => void;
};
type ConnectedProps = {
  description?: InterProDescription;
  search: InterProLocationSearch;
  field: string;
  goToCustomLocation: typeof goToCustomLocation;
};

const ConnectedSortButton = React.forwardRef<
  ExposedButtonProps,
  ConnectedProps
>(({ description, search, field, goToCustomLocation }, ref) => {
  let mode = SORT_OFF;
  const { sort_by } = search;
  const sortBy = sort_by as string;

  // If multiple columns are added to sort
  if (sortBy?.split(',').length > 1) {
    if (sortBy.includes(field)) mode = SORT_UP;
  } else {
    if (sortBy === field) mode = SORT_UP;
    if (sortBy === `-${field}`) mode = SORT_DOWN;
  }
  const toggleSort = () => {
    const newMode = (mode + 1) % NUMBER_OF_SORT_MODES;

    if (newMode > 0) {
      search.sort_by = `${newMode === SORT_DOWN ? '-' : ''}${field}`;
    } else {
      delete search.sort_by;
    }
    goToCustomLocation({ description: description, search: { ...search } });
  };
  useImperativeHandle(ref, () => ({
    toggleSort,
  }));

  return <SortButton mode={mode} onClick={toggleSort} />;
});

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (description, search) => ({ description, search }),
);

export default connect(mapStateToProps, { goToCustomLocation }, null, {
  forwardRef: true,
})(ConnectedSortButton);
