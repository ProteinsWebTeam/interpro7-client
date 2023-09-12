import React, { useState, useEffect } from 'react';

import { noop } from 'lodash-es';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { requestFullScreen, exitFullScreen } from 'utils/fullscreen';
import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts);

type Props = {
  onFullScreenHook?: () => void;
  onExitFullScreenHook?: () => void;
  element?: string | HTMLElement | null;
  tooltip: string;
  className?: string;
  dataIcon?: string;
  disabled?: boolean;
};
const FullScreenButton = ({
  element,
  tooltip,
  className,
  dataIcon,
  disabled = false,
  onFullScreenHook = noop,
  onExitFullScreenHook = noop,
}: Props) => {
  const [elementInDOM, setElementInDom] = useState<
    HTMLElement | null | undefined
  >(null);
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
  useEffect(() => {
    setElementInDom(
      typeof element === 'string' ? document.getElementById(element) : element
    );
  }, [element]);

  if (!elementInDOM) return null;
  const _handleFullScreen = () => {
    if (isFull) {
      exitFullScreen();
      onExitFullScreenHook();
    } else {
      requestFullScreen(elementInDOM).then(() => onFullScreenHook());
    }
    setFull(!isFull);
  };
  const _className =
    className || css('margin-bottom-none', 'icon', 'icon-common');
  const icon = dataIcon || (isFull ? 'G' : 'F');
  return (
    <Tooltip title={tooltip}>
      <button
        onClick={_handleFullScreen}
        data-icon={icon}
        title={tooltip}
        className={_className}
        disabled={disabled}
      />
    </Tooltip>
  );
};

export default FullScreenButton;
