import React, { ReactNode, useRef, useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import DomainPopup from 'components/ProteinViewer/Popup/RepresentativeDomain';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

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
  colorDomainsBy?: keyof typeof EntryColorMode;
  openTooltip: (element: HTMLElement | undefined, content: ReactNode) => void;
  closeTooltip: () => void;
};

const RepresentativeDomainsTrack = ({
  entries,
  highlightColor,
  hideCategory,
  length,
  colorDomainsBy,
  openTooltip,
  closeTooltip,
}: Props) => {
  const [data, setData] = useState(entries);
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
  useEffect(() => {
    setData(
      entries.map((entry) => ({
        ...entry,
        color: getTrackColor(entry, colorDomainsBy),
      }))
    );
  }, [entries, colorDomainsBy]);
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
          data={data}
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  })
);
export default connect(mapStateToProps)(RepresentativeDomainsTrack);
