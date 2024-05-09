import React, { useId } from 'react';

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
const labelMap: Array<[LabelOptions, string]> = [
  ['accession', 'Accession'],
  ['name', 'Name'],
  ['short', 'Short Name'],
];

const LabelBy = ({ labelContent, changeSettingsRaw }: Props) => {
  const id = useId();
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
    <section>
      <ul className={css('nested-list', 'no-bullet')}>
        <header>Label by</header>
        {labelMap.map(([key, label]) => (
          <li key={key}>
            <div
              className={css('vf-form__item', 'vf-form__item--checkbox')}
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              <input
                className="vf-form__checkbox"
                type="checkbox"
                onChange={updateLabel}
                value={key}
                checked={labelContent[key]}
                id={`${id}-${key}`}
              />
              <label className={css('vf-form__label')} htmlFor={`${id}-${key}`}>
                {label}
              </label>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: UISettings) => ({
    labelContent: ui.labelContent,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(LabelBy);
