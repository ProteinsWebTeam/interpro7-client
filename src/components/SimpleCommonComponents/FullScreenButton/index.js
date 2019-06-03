import React from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import fonts from 'EBI-Icon-fonts/fonts.css';

import { foundationPartial } from 'styles/foundation';
import { requestFullScreen } from 'utils/fullscreen';

const f = foundationPartial(fonts);

const FullScreenButton = ({
  handleFullScreen,
  element,
  tooltip,
  className,
  dataIcon = 'F',
}) => {
  if (!handleFullScreen && !element) return null;
  const _handleFullScreen =
    handleFullScreen || (() => requestFullScreen(element));
  const _className =
    className || f('margin-bottom-none', 'icon', 'icon-common');
  return (
    <Tooltip title={tooltip}>
      <button
        onClick={_handleFullScreen}
        data-icon={dataIcon}
        title="Full screen"
        className={_className}
      />
    </Tooltip>
  );
};

FullScreenButton.propTypes = {
  handleFullScreen: T.func,
  element: T.any,
  tooltip: T.string,
  className: T.string,
  dataIcon: T.string,
};

export default FullScreenButton;
