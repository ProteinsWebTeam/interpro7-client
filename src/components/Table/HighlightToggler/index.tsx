import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';

const css = cssBinder(fonts, s);

type Props = {
  changeSettingsRaw?: typeof changeSettingsRaw;
  shouldHighlight?: boolean;
  visible?: boolean;
};

export const HighlightToggler = ({
  changeSettingsRaw,
  shouldHighlight,
  visible,
}: Props) => {
  const handleHighlightToggler = () => {
    changeSettingsRaw?.('ui', 'shouldHighlight', !shouldHighlight);
  };

  return (
    <button
      className={css(
        'icon',
        'icon-common',
        'ico-neutral',
        'highlight-toggler',
        {
          hidden: !visible,
          on: shouldHighlight,
        },
      )}
      data-icon="&#xf0fd;"
      type="button"
      aria-label="Highlight toggler"
      onClick={handleHighlightToggler}
    />
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state?.settings?.ui?.shouldHighlight,
  (state: GlobalState) => state.customLocation?.search?.search,
  (state: GlobalState) => state.customLocation?.description?.main?.key,
  (state: GlobalState) => state.customLocation?.description?.search,
  (shouldHighlight, search, key, globalSearch) => ({
    shouldHighlight,
    visible:
      !!search ||
      (key === 'search' &&
        globalSearch.type === 'text' &&
        !!globalSearch.value),
  }),
);

export default connect(mapStateToProps, {
  changeSettingsRaw,
})(HighlightToggler);
