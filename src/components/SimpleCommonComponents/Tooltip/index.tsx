import React, { useState, useRef, PropsWithChildren } from 'react';
import {
  useFloating,
  FloatingArrow,
  FloatingPortal,
  autoPlacement,
  arrow,
  offset,
  size,
} from '@floating-ui/react';
import useStateRef from 'utils/hooks/useStateRef';

const TOOLTIP_DELAY = 150;

import cssBinder from 'styles/cssBinder';

import style from 'components/SimpleCommonComponents/Tooltip/style.css';

const css = cssBinder(style);

type Props = PropsWithChildren<{
  /** Content of the tooltip, accepts strings or JSX elements */
  title?: React.ReactElement | string | number;
  /** (Deprecated in favor of `title`) Content of the tooltip  */
  html?: React.ReactElement | string | number;
  /** try setting this to `true` if the popopu is misaligned with the expected component */
  useContext?: boolean;
  /** offset distance from the target element to the tooltip. */
  distance?: number;
  /**  Do you expect the user to interact with the content of the tooltip? a button or something in it?. Then set this to `true`*/
  interactive?: boolean;
  /** Array of extra classes to include in the tooltip.*/
  classNames?: string[];
  [otherProp: string]: unknown;
}>;

const Tooltip = ({
  html,
  title,
  useContext,
  children,
  distance = 0,
  interactive = false,
  classNames = [],
  ...rest
}: Props) => {
  const arrowRef = useRef(null);
  const [_, setOverTooltip, overTooltipRef] = useStateRef(false);
  const intervalId = useRef<NodeJS.Timer | null>(null);
  const [hide, setHide] = useState(true);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      autoPlacement(),
      offset({
        mainAxis: 10 + distance,
      }),
      arrow({
        element: arrowRef,
      }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(availableWidth, 400)}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
  });

  let content = html || title || '';
  if (typeof content === 'string') {
    // eslint-disable-next-line react/no-danger
    content = <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  const scheduleHide = () => {
    if (!intervalId.current)
      intervalId.current = setInterval(() => {
        if (!overTooltipRef.current) {
          setHide(true);
          if (intervalId.current) {
            clearInterval(intervalId.current as unknown as number);
            intervalId.current = null;
          }
        }
      }, TOOLTIP_DELAY);
  };
  return (
    <>
      {hide ? null : (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={css('popper', ...classNames)}
            onMouseEnter={() => setOverTooltip(true)}
            onMouseLeave={() => setOverTooltip(false)}
          >
            <FloatingArrow ref={arrowRef} context={context} />
            {content}
          </div>
        </FloatingPortal>
      )}
      <div
        {...rest}
        ref={refs.setReference}
        onMouseEnter={() => setHide(false)}
        onMouseLeave={() => (interactive ? scheduleHide() : setHide(true))}
        style={useContext ? {} : { display: 'inline' }}
      >
        {children}
      </div>
    </>
  );
};

export default Tooltip;
