import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import {
  useFloating,
  FloatingArrow,
  FloatingPortal,
  autoPlacement,
  arrow,
  offset,
} from '@floating-ui/react';

import cssBinder from 'styles/cssBinder';
import style from 'components/SimpleCommonComponents/Tooltip/style.css';

const css = cssBinder(style);

type Props = {
  showTooltip: boolean;
  message: React.ReactNode;
  referenceElement?: Element | null;
}
const TooltipWithoutChildren = ({
  showTooltip,
  message,
  referenceElement,
}: Props) => {
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      autoPlacement(),
      offset({
        mainAxis: 10,
      }),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  useEffect(() => {
    if (referenceElement)
      refs.setReference(referenceElement);
  }, [referenceElement])

  return (
    <FloatingPortal>
      {showTooltip ? (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={css('popper')}
        >
          <FloatingArrow ref={arrowRef} context={context} />
          <div>{message}</div>
        </div>
      ) : null}
    </FloatingPortal>

  )

}
export default TooltipWithoutChildren;