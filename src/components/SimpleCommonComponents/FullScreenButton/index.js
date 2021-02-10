// @flow
import React, { useState, useEffect } from 'react';
import T from 'prop-types';

import { noop } from 'lodash-es';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import { requestFullScreen, exitFullScreen } from 'utils/fullscreen';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

const FullScreenButton = (
  {
    element,
    tooltip,
    className,
    dataIcon,
    disabled = false,
    onFullScreenHook = noop,
    onExitFullScreenHook = noop,
  } /*: {onFullScreenHook?: function,onExitFullScreenHook?: function, element?: any, tooltip: string, className?: string, dataIcon?: string, disabled?: boolean} */,
) => {
  const [isFull, setFull] = useState(false);
  const onFullscreen = () => {
    if (document.fullscreenElement === null) {
      setFull(false);
      onExitFullScreenHook();
    }
  };
  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);
  if (!element) return null;
  const elementInDOM =
    typeof element === 'string' ? document.getElementById(element) : element;
  const _handleFullScreen = () => {
    if (isFull) {
      exitFullScreen();
      onExitFullScreenHook();
    } else {
      requestFullScreen(elementInDOM);
      onFullScreenHook();
    }
    setFull(!isFull);
  };
  const _className =
    className || f('margin-bottom-none', 'icon', 'icon-common');
  const icon = dataIcon || (isFull ? 'G' : 'F');
  return (
    <Tooltip title={tooltip}>
      <button
        onClick={_handleFullScreen}
        data-icon={icon}
        title="Full screen"
        className={_className}
        disabled={disabled}
      />
    </Tooltip>
  );
};

FullScreenButton.propTypes = {
  handleFullScreen: T.func,
  onFullScreenHook: T.func,
  onExitFullScreenHook: T.func,
  element: T.any,
  tooltip: T.string,
  className: T.string,
  dataIcon: T.string,
  disabled: T.bool,
};

export default FullScreenButton;
