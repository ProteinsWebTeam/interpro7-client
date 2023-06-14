import React, { useState, useEffect, ReactNode } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';
import { LineData } from '@nightingale-elements/nightingale-linegraph-track';

import NightingaleTrack from 'components/Nightingale/Track';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleLinegraphTrack from 'components/Nightingale/Linegraph';
import NightingaleColoredSequence from 'components/Nightingale/ColoredSequence';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';
import { ExtendedFeature } from '..';
import LabelsInTrack from '../LabelsInTrack';

import useStateRef from 'utils/hooks/useStateRef';
import ProtVistaPopup, { PopupDetail } from 'components/ProtVista/Popup';

const css = cssBinder(style, grid);

// TODO: get from nightingale types
type EventType = 'click' | 'mouseover' | 'mouseout' | 'reset';
type DetailInterface = {
  eventType: EventType;
  feature?: ExtendedFeature | null;
  target?: HTMLElement;
  highlight?: string;
  selectedId?: string | null;
  parentEvent?: Event;
};

const OTHER_TRACK_TYPES = [
  'secondary_structure',
  'sequence_conservation',
  'confidence',
  'residue',
  'Model',
  'Domain',
];
const b2sh = new Map([
  ['N_TERMINAL_DISC', 'discontinuosStart'], // TODO fix spelling in this and nightingale
  ['C_TERMINAL_DISC', 'discontinuosEnd'],
  ['CN_TERMINAL_DISC', 'discontinuos'],
  ['NC_TERMINAL_DISC', 'discontinuos'],
]);

const webComponents = [
  'nightingale-colored-sequence',
  'nightingale-linegraph-track',
  'nightingale-interpro-track',
  'nightingale-track',
];
const mapToFeatures = (entry: ExtendedFeature, colorDomainsBy: string) =>
  (entry.entry_protein_locations || entry.locations || []).map((loc) => ({
    accession: entry.accession,
    name: entry.name,
    short_name: entry.short_name,
    source_database: entry.source_database,
    locations: [loc],
    color: getTrackColor(entry, colorDomainsBy),
    entry_type: entry.entry_type,
    type: entry.type || 'entry',
    residues: entry.residues && JSON.parse(JSON.stringify(entry.residues)),
    chain: entry.chain,
    protein: entry.protein,
    confidence: loc.confidence,
  }));

const mapToContributors = (entry: ExtendedFeature, colorDomainsBy: string) =>
  entry.children?.map((child) => ({
    accession: child.accession,
    chain: entry.chain,
    name: child.name,
    short_name: child.short_name,
    residues: child.residues && JSON.parse(JSON.stringify(child.residues)),
    source_database: child.source_database,
    entry_type: child.entry_type,
    type: child.type,
    locations: (child.entry_protein_locations || child.locations || []).map(
      (loc) => ({
        ...loc,
        fragments: loc.fragments.map((f) => ({
          shape: b2sh.get(
            (f as unknown as { 'dc-status': string })['dc-status']
          ),
          ...f,
        })),
      })
    ),
    parent: entry,
    color: getTrackColor(
      Object.assign(child, { parent: entry }),
      colorDomainsBy
    ),
    location2residue: child.location2residue,
    // expanded: true,
  }));

type Props = {
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  enableTooltip: boolean;
  isPrinting: boolean;
  openTooltip: (element: HTMLElement | undefined, content: ReactNode) => void;
  closeTooltip: () => void;
  sequence: string;
  customLocation?: InterProLocation;
  goToCustomLocation?: typeof goToCustomLocation;
  colorDomainsBy?: string;
};
const TracksInCategory = ({
  entries,
  sequence,
  hideCategory,
  enableTooltip,
  isPrinting,
  highlightColor,
  customLocation,
  goToCustomLocation,
  openTooltip,
  closeTooltip,
  colorDomainsBy,
}: Props) => {
  const [expandedTrack, setExpandedTrack, expandedTrackRef] = useStateRef<
    Record<string, boolean>
  >({});
  const [hasListeners, setHasListeners] = useState<Record<string, boolean>>({});
  const [hasData, setHasData] = useState<Record<string, boolean>>({});

  const handleTrackEvent = ({ detail }: { detail: DetailInterface }) => {
    if (detail) {
      const accession = detail.feature?.accession || '';
      switch (detail.eventType) {
        case 'click':
          setExpandedTrack({
            ...expandedTrackRef.current,
            [accession]: !expandedTrackRef.current[accession],
          });
          break;
        case 'mouseout':
          closeTooltip();
          break;
        case 'mouseover':
          if (enableTooltip) {
            const sourceDatabase = detail.feature?.source_database || '';
            if (customLocation && goToCustomLocation)
              openTooltip(
                detail.target,
                <ProtVistaPopup
                  detail={detail as unknown as PopupDetail}
                  sourceDatabase={sourceDatabase}
                  currentLocation={customLocation}
                  // Need to pass it from here because it rendered out of the redux provider
                  goToCustomLocation={goToCustomLocation}
                />
              );
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    setHasData({}); // Forcing reload of the data
  }, [colorDomainsBy]);

  useEffect(() => {
    setExpandedTrack(
      Object.fromEntries(
        entries
          .filter((entry) => !OTHER_TRACK_TYPES.includes(entry.type || ''))
          .map((entry) => [entry.accession, true])
      )
    );
    Promise.all(webComponents.map((wc) => customElements.whenDefined(wc))).then(
      () => {
        const addedListeners: Record<string, boolean> = {};
        const addedData: Record<string, boolean> = {};
        for (const entry of entries) {
          const track = document.getElementById(`track_${entry.accession}`);
          if (track) {
            // setting up the listeners
            if (!hasListeners[entry.accession]) {
              track.addEventListener('change', (evt) =>
                handleTrackEvent({ detail: (evt as CustomEvent).detail })
              );
              addedListeners[entry.accession || ''] = true;
            }
            // adding the data
            if (!hasData[entry.accession]) {
              if (
                ['nightingale-track', 'nightingale-interpro-track'].includes(
                  track.tagName.toLowerCase()
                )
              ) {
                (track as any).data = mapToFeatures(
                  entry,
                  colorDomainsBy || 'ACCESSION'
                );
                const contributors = mapToContributors(
                  entry,
                  colorDomainsBy || 'ACCESSION'
                );
                if (contributors) (track as any).contributors = contributors;
              }
              addedData[entry.accession || ''] = true;
            }
          }
        }
        if (Object.keys(addedListeners).length)
          setHasListeners({
            ...hasListeners,
            ...addedListeners,
          });
        if (Object.keys(addedData).length)
          setHasData({
            ...hasData,
            ...addedData,
          });
      }
    );
  }, [entries, hasData]);

  return (
    <>
      {entries &&
        entries.map((entry) => {
          const type = entry.type || '';

          return (
            <React.Fragment key={entry.accession}>
              <div
                className={css('track', {
                  hideCategory,
                })}
              >
                {OTHER_TRACK_TYPES.includes(type) ? (
                  <div className={css('track', type.replace('_', '-'))}>
                    {entry.type === 'sequence_conservation' &&
                      (entry.warnings || []).length > 0 && (
                        <div className={css('conservation-warning')}>
                          {(entry.warnings || []).map((message) => (
                            <div key={message}>{message}</div>
                          ))}
                        </div>
                      )}
                    {entry.type === 'sequence_conservation' &&
                      (entry.warnings || []).length === 0 && (
                        <NightingaleLinegraphTrack
                          data={entry.data as LineData[]}
                          length={sequence.length}
                          type="conservation"
                          id={`track_${entry.accession}`}
                          margin-color="#fafafa"
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          use-ctrl-to-zoom
                        />
                      )}
                    {entry.type === 'confidence' && (
                      <NightingaleColoredSequence
                        id={`track_${entry.accession}`}
                        data={entry.data as string}
                        length={sequence.length}
                        scale="H:90,M:70,L:50,D:0"
                        height={12}
                        color-range="#ff7d45:0,#ffdb13:50,#65cbf3:70,#0053d6:90,#0053d6:100"
                        margin-left={10}
                        margin-right={10}
                        margin-color="#fafafa"
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        className="confidence"
                        use-ctrl-to-zoom
                      />
                    )}
                    {[
                      'secondary_structure',
                      'residue',
                      'Model',
                      'Domain',
                    ].includes(entry.type || '') && (
                      <NightingaleTrack
                        length={sequence.length}
                        margin-color="#fafafa"
                        height={15}
                        id={`track_${entry.accession}`}
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        use-ctrl-to-zoom
                      />
                    )}{' '}
                  </div>
                ) : (
                  <NightingaleInterProTrack
                    length={sequence.length}
                    margin-color="#fafafa"
                    id={`track_${entry.accession}`}
                    shape="roundRectangle"
                    highlight-event="onmouseover"
                    highlight-color={highlightColor}
                    show-label
                    label=".feature.short_name"
                    use-ctrl-to-zoom
                    expanded={!!expandedTrack[entry.accession]}
                  />
                )}
              </div>
              <LabelsInTrack
                entry={entry}
                hideCategory={hideCategory}
                expandedTrack={!!expandedTrack[entry.accession]}
                isPrinting={isPrinting}
              />
            </React.Fragment>
          );
        })}
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.ui,
  (customLocation: InterProLocation, ui: Record<string, unknown>) => ({
    customLocation,
    colorDomainsBy:
      (ui.colorDomainsBy as string) || EntryColorMode.DOMAIN_RELATIONSHIP,
  })
);
export default connect(mapStateToProps, { goToCustomLocation })(
  TracksInCategory
);
