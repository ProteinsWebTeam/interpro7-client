/* eslint no-magic-numbers: [1, {ignore: [-1, 1, 10, 20, 50, 100]}] */
import React, { FormEvent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation, changePageSize } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import s from './style.css';

const f = cssBinder(s);

const OPTIONS = [20, 50, 100];

const getPageSize = createSelector(
  (props) => props,
  (props) => +(props.customLocation.search.page_size || props.settingsPageSize),
);
type Props = {
  customLocation?: InterProLocation;
  settingsPageSize?: number;
  changePageSize?: typeof changePageSize;
  goToCustomLocation?: typeof goToCustomLocation;
};

const PageSizeSelector = (props: Props) => {
  if (!props.customLocation) return null;
  const { customLocation, goToCustomLocation } = props;
  const _handleChange = (event: FormEvent) => {
    const value = (event.target as HTMLSelectElement).value;
    const { cursor, page, ...search } = customLocation.search;
    goToCustomLocation?.({
      ...customLocation,
      search: {
        ...search,
        page_size: +value,
      },
    });
  };
  let options = [...OPTIONS];
  if (!options.includes(getPageSize(props))) {
    options = Array.from(new Set([...options, getPageSize(props)])).sort(
      (a, b) => a - b,
    );
  }
  return (
    <div className={f('table-length')}>
      Rows per page:{' '}
      <select
        className={f('small')}
        style={{ width: 'auto' }}
        value={getPageSize(props)}
        onChange={_handleChange}
        onBlur={_handleChange}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.navigation.pageSize,
  (state: GlobalState) => state.customLocation,
  (settingsPageSize, customLocation) => ({ settingsPageSize, customLocation }),
);

export default connect(mapStateToProps, { changePageSize, goToCustomLocation })(
  PageSizeSelector,
);
