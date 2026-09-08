import { RefObject, useEffect } from 'react';

// Click-outside and Escape dismissal for the viewer's small popovers. The
// listeners are only attached while the popover is open, so a closed one costs
// nothing, and they are torn down on unmount.
const useDismissable = (
  isOpen: boolean,
  rootRef: RefObject<HTMLElement | null>,
  close: () => void,
) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
    // Keyed on `isOpen` alone: `rootRef` is stable, and `close` only ever wraps
    // a state setter, so re-attaching on every render would buy nothing.
  }, [isOpen]);
};

export default useDismissable;
