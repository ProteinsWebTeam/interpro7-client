import React, { FormEvent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

type Props = {
  field: string;
  options: Array<string>;
  search: InterProLocationSearch;
  description: InterProDescription;
  goToCustomLocation: typeof goToCustomLocation;
};

export const ColumnSelectMenu = ({
  field,
  options,
  search,
  description,
  goToCustomLocation,
}: Props) => {
  const onSelection = (event: FormEvent) => {
    const option = (event?.target as HTMLSelectElement).value;
    search[field] = option;
    goToCustomLocation({ description: description, search: { ...search } });
  };
  return (
    <select
      className={'inline-select'}
      name={'column-select'}
      onChange={onSelection}
      onBlur={onSelection}
      value={String(search[field])}
    >
      <option
        //   className={f('placeholder')}
        value=""
      >
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (description, search) => ({ description, search }),
);

export default connect(mapStateToProps, {
  goToCustomLocation,
})(ColumnSelectMenu);
