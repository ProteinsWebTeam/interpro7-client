import React, { useId } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import protvistaCSS from '../style.css';

const css = cssBinder(protvistaCSS);

type Props = {
  matchTypeSettings: MatchTypeUISettings;
  changeSettingsRaw: typeof changeSettingsRaw;
};

type matchTypes = 'hmm' | 'nn';
const matchMap: Array<[matchTypes, string]> = [
  ['hmm', 'InterPro'],
  ['nn', 'DeepMind'],
];

const MatchType = ({ matchTypeSettings, changeSettingsRaw }: Props) => {
  const id = useId();
  const updateMatch = (evt: React.FormEvent) => {
    const opt = (evt.target as HTMLInputElement).value;
    if (['hmm', 'nn'].includes(opt)) {
      const next = {
        ...matchTypeSettings,
        [opt]: !matchTypeSettings?.[opt as matchTypes],
      };
      if (!next.hmm && !next.nn) {
        next.hmm = true;
      }
      changeSettingsRaw('ui', 'matchTypeSettings', next);
    }
  };

  return (
    <section>
      <ul className={css('nested-list', 'no-bullet')}>
        <header>Match Type</header>
        {matchMap.map(([key, label]) => (
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
                onChange={updateMatch}
                value={key}
                checked={matchTypeSettings[key]}
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
    matchTypeSettings: ui.matchTypeSettings,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(MatchType);
