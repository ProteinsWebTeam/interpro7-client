import React, { ReactNode, useRef, useEffect } from 'react';

import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import DomainPopup from 'components/ProteinViewer/Popup/RepresentativeDomain';

import { ExtendedFeature } from '..';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';
import grid from '../grid.css';

const css = cssBinder(style, grid);

type Props = {
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  length: number;
  openTooltip: (element: HTMLElement | undefined, content: ReactNode) => void;
  closeTooltip: () => void;
};

const RepresentativeDomainsTrack = ({
  entries,
  highlightColor,
  hideCategory,
  length,
  openTooltip,
  closeTooltip,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    containerRef?.current?.addEventListener('change', (event) => {
      const detail = (event as CustomEvent)?.detail;
      if (detail?.eventType === 'mouseover') {
        openTooltip(detail.target, <DomainPopup detail={detail} />);
      }
      if (detail?.eventType === 'mouseout') {
        closeTooltip();
      }
    });
  }, [containerRef]);
  return (
    <>
      <div
        className={css('track', {
          hideCategory,
        })}
        ref={containerRef}
      >
        <NightingaleInterProTrack
          length={length}
          data={entries}
          margin-color="#fafafa"
          id="Domains"
          shape="roundRectangle"
          highlight-event="onmouseover"
          highlight-color={highlightColor}
          show-label
          label=".feature.short_name"
          use-ctrl-to-zoom
        />
      </div>
    </>
  );
};
export default RepresentativeDomainsTrack;
