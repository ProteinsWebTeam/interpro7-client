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
  hasInterPro: boolean;
  hasInterPro_N: boolean;
  changeSettingsRaw: typeof changeSettingsRaw;
};

type matchTypes = 'hmm' | 'dl' | 'best' | 'hmm_and_dl';
const matchMap: Array<[matchTypes, string]> = [
  ['best', 'Default'],
  ['hmm', 'InterPro'],
  ['dl', 'InterPro-N'],
  ['hmm_and_dl', 'Stacked'],
];

const MatchType = ({
  matchTypeSettings,
  hasInterPro,
  hasInterPro_N,
  changeSettingsRaw,
}: Props) => {
  const showOption: Record<string, boolean> = {
    best: true,
    hmm_and_dl: true,
    hmm: hasInterPro,
    dl: hasInterPro_N,
  };

  const getDisabledTooltip = (key: matchTypes): string | null => {
    if (showOption[key]) return null;

    switch (key) {
      case 'hmm':
        return 'This option is disabled because there are no InterPro matches available for this entry.';
      case 'dl':
        return 'This option is disabled because there are no InterPro-N matches available for this entry.';
      default:
        return null;
    }
  };

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
            <b>Default</b>: InterPro matches supplemented with InterPro-N<br>
            <b>InterPro</b>: traditional InterPro matches only<br>
            <b>InterPro-N</b>: AI-predicted InterPro-N matches only<br>
            <b>Stacked</b>: Both InterPro and InterPro-N matches</div>`}
          >
            <span
              className={css('small', 'icon', 'icon-common')}
              data-icon="&#xf129;"
            />
          </Tooltip>
        </header>
        {matchMap.map(([key, label]) => {
          const disabledTooltip = getDisabledTooltip(key);
          const option = (
            <div
              className={css('vf-form__item', 'vf-form__item--checkbox')}
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              <input
                className="vf-form__radio"
                type="radio"
                disabled={!showOption[key]}
                onChange={updateMatch}
                value={key}
                checked={key == matchTypeSettings}
                id={`${id}-${key}`}
              />
              <label className={css('vf-form__label')} htmlFor={`${id}-${key}`}>
                {label}
              </label>
            </div>
          );

          return (
            <li key={key}>
              {disabledTooltip ? (
                <Tooltip title={disabledTooltip}>{option}</Tooltip>
              ) : (
                option
              )}
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
