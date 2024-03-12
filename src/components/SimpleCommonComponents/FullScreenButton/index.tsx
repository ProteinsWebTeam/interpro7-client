import React, { useState, useEffect } from 'react';

import { noop } from 'lodash-es';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { requestFullScreen, exitFullScreen } from 'utils/fullscreen';
import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts);

type Props = {
  /**
   * Hook that is call when the full screen action gets trigger
   * @returns void
   */
  onFullScreenHook?: () => void;
  /**
   * Hook that is call when exiting the full screen action
   * @returns void
   */
  onExitFullScreenHook?: () => void;
  /**
   * Either the id, or directly the DOM element to be send to full screen
   */
  element?: string | HTMLElement | null;
  /**
   * Content of the tooltip that appears when hovering this button
   */
  tooltip: string;
  /**
   * Extra CSS classes to add
   */
  className?: string;
  /**
   * Should we change the icon for one from https://www.ebi.ac.uk/style-lab/general/fonts/v1.3/
   */
  dataIcon?: string;
  /**
   * To disable the component
   */
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
      typeof element === 'string' ? document.getElementById(element) : element,
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
