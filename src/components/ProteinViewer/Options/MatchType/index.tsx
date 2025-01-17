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

type matchTypes = 'hmm' | 'dl' | 'hmm_and_dl';
const matchMap: Array<[matchTypes, string]> = [
  ['hmm', 'InterPro'],
  ['dl', 'IntePro-N'],
  ['hmm_and_dl', 'InterPro & IntePro-N'],
];
const MatchType = ({ matchTypeSettings, changeSettingsRaw }: Props) => {
  const id = useId();
  const updateMatch = (evt: React.FormEvent) => {
    if (changeSettingsRaw)
      changeSettingsRaw(
        'ui',
        'matchTypeSettings',
        (evt.target as HTMLInputElement)?.value,
      );
  };

  return (
    <section>
      <ul className={css('nested-list', 'no-bullet')}>
        <header>Display matches from </header>
        {matchMap.map(([key, label]) => {
          return (
            <>
              <li key={key}>
                <div
                  className={css('vf-form__item', 'vf-form__item--checkbox')}
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  <input
                    className="vf-form__radio"
                    type="radio"
                    onChange={updateMatch}
                    value={key}
                    checked={key == matchTypeSettings}
                    id={`${id}-${key}`}
                  />
                  <label
                    className={css('vf-form__label')}
                    htmlFor={`${id}-${key}`}
                  >
                    {label}
                  </label>
                </div>
              </li>
            </>
          );
        })}
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
