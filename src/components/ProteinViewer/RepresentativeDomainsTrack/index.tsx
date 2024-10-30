import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import ProtVistaPopup, { PopupDetail } from '../Popup';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';
import grid from '../grid.css';

const css = cssBinder(style, grid);
import { ExtendedFeature } from '..';

type EventType =
  | 'click'
  | 'mouseover'
  | 'mouseenter'
  | 'mouseleave'
  | 'mouseout'
  | 'reset';
type DetailInterface = {
  eventType: EventType;
  feature?: ExtendedFeature | null;
  target?: HTMLElement;
  highlight?: string;
  selectedId?: string | null;
  parentEvent?: Event;
};

type Props = {
  type: string;
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  length: number;
  colorDomainsBy?: keyof typeof EntryColorMode;
  openTooltip: (element: HTMLElement | undefined, content: ReactNode) => void;
  closeTooltip: () => void;
  isPrinting: boolean;
  customLocation?: InterProLocation;
};

const RepresentativeTrack = ({
  type,
  entries,
  highlightColor,
  hideCategory,
  length,
  colorDomainsBy,
  openTooltip,
  closeTooltip,
  isPrinting,
  customLocation,
}: Props) => {
  const [data, setData] = useState(entries);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipTimeout = useRef<number | null>(null);
  const hasTooltipOpen = useRef(false); // tracks tooltip open state

  // Update data with track color based on the selected color mode
  useEffect(() => {
    setData(
      entries.map((entry) => ({
        ...entry,
        color: getTrackColor(
          colorDomainsBy === EntryColorMode.DOMAIN_RELATIONSHIP
            ? {
                parent: entry.integrated
                  ? { accession: entry.integrated }
                  : null,
              }
            : entry,
          colorDomainsBy,
        ),
      })),
    );
  }, [entries, colorDomainsBy]);

  // Tooltip event handling
  const handleTrackEvent = (event: CustomEvent<DetailInterface>) => {
    const { detail } = event;
    if (detail.eventType === 'mouseover' && !hasTooltipOpen.current) {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      hasTooltipOpen.current = true; // Set the flag to prevent re-triggering
      if (customLocation)
        openTooltip(
          detail.target,
          <ProtVistaPopup
            detail={detail as unknown as PopupDetail}
            sourceDatabase={detail.feature?.source_database || ''}
            currentLocation={customLocation}
          />,
        );
    } else if (detail.eventType === 'mouseout' && hasTooltipOpen.current) {
      tooltipTimeout.current = window.setTimeout(() => {
        closeTooltip();
        hasTooltipOpen.current = false;
      }, 50);
    }
  };

  // Attach event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('change', (event) =>
        handleTrackEvent(event as CustomEvent<DetailInterface>),
      );
    }
    return () => {
      if (container) {
        //container.removeEventListener('change', handleTrackEvent);
      }
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, [closeTooltip]);

  return (
    <>
      <div className={css('track', { hideCategory })} ref={containerRef}>
        <NightingaleInterProTrack
          length={length}
          data={data}
          margin-color="#fafafa"
          margin-left={20}
          id="Domains"
          shape="roundRectangle"
          highlight-event="onmouseover"
          highlight-color={highlightColor}
          show-label
          label=".feature.short_name"
          use-ctrl-to-zoom
        />
      </div>
      <div className={css('track-label', 'centered-label')}>
        <b>Representative {type.toLowerCase()}</b>
      </div>
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.ui,
  (customLocation: InterProLocation, ui: Record<string, unknown>) => ({
    customLocation,
    colorDomainsBy:
      (ui.colorDomainsBy as keyof typeof EntryColorMode) ||
      EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default connect(mapStateToProps, null, null, { forwardRef: true })(
  RepresentativeTrack,
);
