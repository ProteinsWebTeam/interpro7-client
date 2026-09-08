import React, { useRef, useState } from 'react';

import Button from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import SizeSlider from '../SizeSlider';
import useDismissable from '../useDismissable';

import style from '../style.css';

const css = cssBinder(style);

type Props = {
  nodeScale: number;
  onNodeScaleChange: (value: number) => void;
  fontScale: number;
  onFontScaleChange: (value: number) => void;
};

// A popover rather than sliders that appear inline in the toolbar: two sliders
// are wide enough that revealing them would reflow the row and shove the
// full-screen button sideways every time they were opened. Anchored under the
// button, the toolbar keeps its shape and the sliders stay next to the control
// that summoned them.
const SizeControls = ({
  nodeScale,
  onNodeScaleChange,
  fontScale,
  onFontScaleChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useDismissable(isOpen, rootRef, () => setIsOpen(false));

  return (
    <div className={css('clan-network-sizes')} ref={rootRef}>
      <Button
        type={isOpen ? 'primary' : 'secondary'}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="clanNetworkSizeControls"
      >
        {isOpen ? 'Hide size controls' : 'Show size controls'}
      </Button>
      {isOpen && (
        <div
          id="clanNetworkSizeControls"
          className={css('clan-network-sizes-panel')}
        >
          <SizeSlider
            label="Node size"
            value={nodeScale}
            onChange={onNodeScaleChange}
          />
          <SizeSlider
            label="Label size"
            value={fontScale}
            onChange={onFontScaleChange}
          />
        </div>
      )}
    </div>
  );
};

export default SizeControls;
