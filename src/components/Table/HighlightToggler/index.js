// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';
const f = foundationPartial(fonts, s);

/*:: type Props = {
  changeSettingsRaw: function,
  shouldHighlight?: ?boolean,
  visible?: ?boolean,
}; */

export const HighlightToggler = (
  { changeSettingsRaw, shouldHighlight, visible } /*: Props*/,
) => {
  const handleHighlightToggler = () => {
    changeSettingsRaw('ui', 'shouldHighlight', !shouldHighlight);
  };

  return (
    <button
      className={f('icon', 'icon-common', 'ico-neutral', 'highlight-toggler', {
        hidden: !visible,
        on: shouldHighlight,
      })}
      data-icon="&#xf0fd;"
      type="button"
      aria-label="Highlight toggler"
      onClick={handleHighlightToggler}
    />
  );
};
HighlightToggler.propTypes = {
  changeSettingsRaw: T.func,
  shouldHighlight: T.bool,
  visible: T.bool,
};
const mapStateToProps = createSelector(
  (state) => state?.settings?.ui?.shouldHighlight,
  (state) => state.customLocation?.search?.search,
  (state) => state.customLocation?.description?.main?.key,
  (state) => state.customLocation?.description?.search,
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
