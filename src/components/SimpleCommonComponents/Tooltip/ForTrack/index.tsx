import React, { useState, PropsWithChildren } from 'react';
import TooltipWithoutChildren from '../WithoutChildren';

type Props = PropsWithChildren<{
  message: React.ReactNode;
  onMouseOverFeature?: (locations: Array<ProtVistaLocation>) => void;
}>

const TooltipForTrack = ({
  children,
  onMouseOverFeature,
  message,
}: Props) => {
  const [reference, setReference] = useState<Element | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const popupTargetClass = 'feature';

  const _handleMouseOver = (e: React.MouseEvent | React.FocusEvent) => {
    const target = e.target as SVGElement & { __data__: ProtVistaLocation };
    if (target?.classList?.contains(popupTargetClass)) {
      // d3 sets the data of an elemen in __data__ - This needs to be check on major updates of d3
      if (target?.__data__) {
        onMouseOverFeature?.([target.__data__]);
        setReference(target);
        setShowTooltip(true);
      }
    }
    // setShouldoad(true);
  };
  const _handleMouseOut = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div
        style={{ display: 'inline' }}
        onMouseOver={(e: React.MouseEvent) => _handleMouseOver(e)}
        onFocus={(e: React.FocusEvent) => _handleMouseOver(e)}
        onMouseOut={_handleMouseOut}
        onBlur={_handleMouseOut}
      >
        {children}
      </div>
      <TooltipWithoutChildren
        showTooltip={showTooltip}
        message={message}
        referenceElement={reference}
      />
    </>
  );
}
export default TooltipForTrack;