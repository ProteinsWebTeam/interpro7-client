// @flow
import React, { useState, useEffect } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import fonts from 'EBI-Icon-fonts/fonts.css';

import { foundationPartial } from 'styles/foundation';
import { requestFullScreen, exitFullScreen } from 'utils/fullscreen';

const f = foundationPartial(fonts);

const FullScreenButton = (
  {
    handleFullScreen,
    element,
    tooltip,
    className,
    dataIcon,
  } /*: {handleFullScreen?: function, element?: any, tooltip: string, className?: string, dataIcon?: string} */,
) => {
  const [isFull, setFull] = useState(false);
  const handleFullscreen = () => setFull(!!document.fullscreenElement);
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreen);
  }, []);
  if (!handleFullScreen && !element) return null;
  const _handleFullScreen =
    handleFullScreen ||
    (() => {
      if (isFull) {
        exitFullScreen();
      } else {
        requestFullScreen(element);
      }
      setFull(!isFull);
    });
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
