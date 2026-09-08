import React, { useRef, useState } from 'react';

import cssBinder from 'styles/cssBinder';

import useDismissable from '../useDismissable';

import style from '../style.css';

const css = cssBinder(style);

type Props = {
  label: string;
  children: React.ReactNode;
};

// The shared Tooltip component opens on hover and portals its content out of
// the viewer, which does not survive full screen; this one opens on click and
// stays inside the canvas, which is all this hint needs.
const HintPopover = ({ label, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useDismissable(isOpen, rootRef, () => setIsOpen(false));

  return (
    <div className={css('clan-network-info')} ref={rootRef}>
      <button
        type="button"
        className={css('clan-network-info-button')}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={label}
        title={label}
      >
        i
      </button>
      {isOpen && (
        <div role="tooltip" className={css('clan-network-info-bubble')}>
          {children}
        </div>
      )}
    </div>
  );
};

export default HintPopover;
