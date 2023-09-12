import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { changeSettingsRaw } from 'actions/creators';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
type Props = {
  isPIPEnabled: boolean;
  changeSettingsRaw: typeof changeSettingsRaw;
  className?: string;
};
const PIPToggleButton = ({
  isPIPEnabled,
  changeSettingsRaw,
  className,
}: Props) => {
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    isPIPEnabled: !!ui.isPIPEnabled,
  })
);

export default connect(mapStateToProps, { changeSettingsRaw })(PIPToggleButton);
