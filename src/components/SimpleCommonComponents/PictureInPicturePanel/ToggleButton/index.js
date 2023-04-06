// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
/*:: type Props = {
  isPIPEnabled: boolean,
  changeSettingsRaw: function,
  className?: string,
} */
const PIPToggleButton = (
  { isPIPEnabled, changeSettingsRaw, className } /*: Props */,
) => {
  const togglePIP = () => {
    changeSettingsRaw('ui', 'isPIPEnabled', !isPIPEnabled);
  };
  const text = `${
    isPIPEnabled ? 'Disable' : 'Enable'
  } The Picture In Picture functionality`;
  return (
    <Tooltip title={text}>
      <button
        className={className}
        onClick={togglePIP}
        data-icon="&#xf247;"
        title={text}
        style={{
          color: isPIPEnabled ? undefined : '#bbb',
        }}
      />
    </Tooltip>
  );
};
PIPToggleButton.propTypes = {
  isPIPEnabled: T.bool.isRequired,
  changeSettingsRaw: T.func,
  className: T.string,
};

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({
    isPIPEnabled: !!ui.isPIPEnabled,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(PIPToggleButton);
