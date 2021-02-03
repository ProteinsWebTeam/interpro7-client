// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import { SearchBox } from 'components/Table';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

const NUMBER_OF_SORT_MODES = 3;
const SORT_OFF = 0;
const SORT_UP = 1;
const SORT_DOWN = 2;

const OPACITY_OFF = 0.4;

export const SortButton = (
  { mode, onClick } /*: {mode: number, onClick: function} */,
) => {
  let icon = '&#xf0dd;';
  let iconClass = 'icon-sort';
  if (SORT_UP === mode) {
    icon = '&#xf0de;';
    iconClass = 'icon-sort-up';
  }
  if (SORT_DOWN === mode) {
    icon = '&#xf0dd;';
    iconClass = 'icon-sort-down';
  }
  return (
    <button onClick={onClick}>
      <span
        className={f(iconClass, 'icon', 'icon-common')}
        data-icon={icon}
        style={{
          opacity: mode === SORT_OFF ? OPACITY_OFF : 1,
        }}
      />
    </button>
  );
};
SortButton.propTypes = {
  mode: T.number,
  onClick: T.func,
};

const _ConnectedSortButton = ({
  description,
  search,
  field,
  goToCustomLocation,
}) => {
  let mode = SORT_OFF;
  const { sort_by: sortBy } = search;

  // If multiple columns are added to sort
  if (sortBy?.split(',').length > 1) {
    if (sortBy.includes(field)) mode = SORT_UP;
  } else {
    if (sortBy === field) mode = SORT_UP;
    if (sortBy === `-${field}`) mode = SORT_DOWN;
  }
  const handleClick = () => {
    const newLocation = {
      description,
      search: search,
    };

    let newMode = (mode + 1) % NUMBER_OF_SORT_MODES;

    // For Genome3D multiple columns can be sorted
    if (description[description.main.key].detail === 'genome3d') {
      newMode = (mode + 1) % 2;
      if (newMode) {
        newLocation.search.sort_by = newLocation.search.sort_by
          ? `${newLocation.search.sort_by},${field}`
          : field;
      } else {
        const oldSet = newLocation.search.sort_by.split(',');
        oldSet.splice(oldSet.indexOf(field), 1);
        newLocation.search.sort_by = oldSet.join(',');
      }
    } else {
      if (newMode > 0) {
        newLocation.search.sort_by = `${
          newMode === SORT_DOWN ? '-' : ''
        }${field}`;
      } else {
        delete newLocation.search.sort_by;
      }
    }
    goToCustomLocation(newLocation);
  };

  return <SortButton mode={mode} onClick={handleClick} />;
};
_ConnectedSortButton.propTypes = {
  description: T.object.isRequired,
  search: T.shape({
    sort_by: T.string,
  }),
  field: T.string,
  goToCustomLocation: T.func.isRequired,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  (description, search) => ({ description, search }),
);

export const ConnectedSortButton = connect(mapStateToProps, {
  goToCustomLocation,
})(_ConnectedSortButton);

export const FilterButton = (
  { isOpen, onClick } /*: {isOpen: boolean, onClick?: ?function} */,
) => {
  return (
    <button onClick={onClick}>
      <span
        className={f('icon-filter', 'icon', 'icon-common')}
        data-icon="f"
        style={{
          opacity: isOpen ? 1 : OPACITY_OFF,
        }}
      />
    </button>
  );
};

FilterButton.propTypes = {
  isOpen: T.bool,
  onClick: T.func,
};

export const _ColumnSelectMenu = ({
  field,
  options,
  search,
  description,
  goToCustomLocation,
}) => {
  const onSelection = ({ target: { value: option } }) => {
    search[field] = option;
    goToCustomLocation({ description: description, search: { ...search } });
  };
  return (
    <select
      className={'inline-select'}
      name={'column-select'}
      onChange={onSelection}
      onBlur={onSelection}
      value={search[field]}
    >
      <option className={f('placeholder')} value="">
        Select
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

_ColumnSelectMenu.propTypes = {
  field: T.string.isRequired,
  options: T.array.isRequired,
  search: T.object,
  description: T.object.isRequired,
  goToCustomLocation: T.func.isRequired,
};

export const ColumnSelectMenu = connect(mapStateToProps, {
  goToCustomLocation,
})(_ColumnSelectMenu);

const _ColumnSearchBox = ({
  field,
  forceToShow,
  search,
  showOptions,
  options,
}) => {
  if (!forceToShow && !(field in search)) return null;
  if (showOptions) return <ColumnSelectMenu field={field} options={options} />;
  return <SearchBox field={field} />;
};

_ColumnSearchBox.propTypes = {
  field: T.string.isRequired,
  forceToShow: T.bool,
  search: T.object,
  showOptions: T.bool,
  options: T.array,
};

export const ColumnSearchBox = connect(mapStateToProps)(_ColumnSearchBox);
