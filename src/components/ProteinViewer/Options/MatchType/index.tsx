import React, { useId } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import protvistaCSS from '../style.css';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-vf.css';
import summary from 'styles/summary.css';
const css = cssBinder(summary, fonts, ipro);

type Props = {
  matchTypeSettings: MatchTypeUISettings;
  changeSettingsRaw: typeof changeSettingsRaw;
};

type matchTypes = 'hmm' | 'dl' | 'best' | 'hmm_and_dl';
const matchMap: Array<[matchTypes, string]> = [
  ['hmm', 'InterPro'],
  ['dl', 'InterPro-N'],
  ['best', 'Optimal'],
  ['hmm_and_dl', 'Stacked'],
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
        <header>
          Display matches from{' '}
          <Tooltip
            title={`
            <div style='text-align:left;'>
            <b>InterPro</b>: Only traditional InterPro matches <br>
            <b>InterPro-N</b>: Only AI-predicted matches<br>
            <b>Optimal</b>: Matches with the best sequence coverage<br>
            <b>Stacked</b>: Both match types for easy comparison</div>`}
          >
            <span
              className={css('small', 'icon', 'icon-common')}
              data-icon="&#xf129;"
              aria-label="Provided By UniProt"
            />
          </Tooltip>
        </header>
        {matchMap.map(([key, label]) => {
          return (
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
