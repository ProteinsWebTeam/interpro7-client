import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import protvistaCSS from '../style.css';

const css = cssBinder(protvistaCSS);

type Props = {
  labelContent: LabelUISettings;
  changeSettingsRaw: typeof changeSettingsRaw;
};

type LabelOptions = 'accession' | 'name' | 'short';
const LabelBy = ({ labelContent, changeSettingsRaw }: Props) => {
  const updateLabel = (evt: React.FormEvent) => {
    const opt = (evt.target as HTMLInputElement).value;
    if (['accession', 'name', 'short'].includes(opt)) {
      const next = {
        ...labelContent,
        [opt]: !labelContent?.[opt as LabelOptions],
      };
      if (!next.accession && !next.name && !next.short) {
        next.accession = true;
      }
      changeSettingsRaw('ui', 'labelContent', next);
    }
  };
  return (
    <li>
      Label by
      <ul className={css('nested-list')}>
        <li key={'accession'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'accession'}
              checked={labelContent.accession}
            />{' '}
            Accession
          </label>
        </li>
        <li key={'name'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'name'}
              checked={labelContent.name}
            />{' '}
            Name
          </label>
        </li>
        <li key={'shortname'}>
          <label>
            <input
              type="checkbox"
              onChange={updateLabel}
              value={'short'}
              checked={labelContent.short}
            />{' '}
            Short Name
          </label>
        </li>
      </ul>
    </li>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: UISettings) => ({
    labelContent: ui.labelContent,
  })
);

export default connect(mapStateToProps, { changeSettingsRaw })(LabelBy);
