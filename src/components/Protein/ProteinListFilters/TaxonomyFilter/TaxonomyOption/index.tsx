import React, { FormEvent } from 'react';

import NumberComponent from 'components/NumberComponent';

import cssBinder from 'styles/cssBinder';

import style from 'components/FiltersPanel/style.css';

const css = cssBinder(style);

type Props = {
  checked: boolean;
  taxId: string;
  count?: number;
  title: string;
  isStale: boolean;
  onChange: (event: FormEvent) => void;
  loading: boolean;
};

const TaxonomyOption = ({
  checked,
  taxId,
  count,
  title,
  isStale,
  onChange,
  loading,
}: Props) => (
  <label className={css('radio-btn-label', { checked })}>
    <input
      type="radio"
      name="entry_type"
      value={taxId}
      disabled={isStale}
      className={css('radio-btn')}
      onChange={onChange}
      checked={checked}
      style={{ margin: '0.25em' }}
    />
    <span>{taxId === 'ALL' ? 'All' : title}</span>
    {typeof count === 'undefined' || isNaN(count) ? null : (
      <NumberComponent
        label
        loading={loading}
        className={css('filter-label')}
        abbr
      >
        {count}
      </NumberComponent>
    )}
  </label>
);

export default TaxonomyOption;
