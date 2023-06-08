import React, { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';

import cssBinder from 'styles/cssBinder';
import { LineData } from '@nightingale-elements/nightingale-linegraph-track';

import NightingaleTrack from 'components/Nightingale/Track';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleLinegraphTrack from 'components/Nightingale/Linegraph';
import NightingaleColoredSequence from 'components/Nightingale/ColoredSequence';
// import NightingaleSequence from 'components/Nightingale/Sequence';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';
import { ExtendedFeature, ExtendedFeatureLocation } from '..';
import LabelsInTrack from '../LabelsInTrack';

import useStateRef from 'utils/hooks/useStateRef';
import useInterval from 'src/utils/hooks/useInterval';

const css = cssBinder(style, grid);

const TOOLTIP_DELAY = 500;

// TODO: get from nightingale types
type EventType = 'click' | 'mouseover' | 'mouseout' | 'reset';
type DetailInterface = {
  eventType: EventType;
  // coords: null | [number, number];
  feature?: ExtendedFeature | null;
  target?: HTMLElement;
  highlight?: string;
  selectedId?: string | null;
  parentEvent?: Event;
};

type Props = {
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  sequence: string;
  popperRef: React.RefObject<HTMLDivElement>;
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
  entry.children
    ? {
        contributors: entry.children.map((child) => ({
          accession: child.accession,
          chain: entry.chain,
          name: child.name,
          short_name: child.short_name,
          residues:
            child.residues && JSON.parse(JSON.stringify(child.residues)),
          source_database: child.source_database,
          entry_type: child.entry_type,
          type: child.type,
          locations: (
            child.entry_protein_locations ||
            child.locations ||
            []
          ).map((loc) => ({
            ...loc,
            fragments: loc.fragments.map((f) => ({
              shape: b2sh.get(
                (f as unknown as { 'dc-status': string })['dc-status']
              ),
              ...f,
            })),
          })),
          parent: entry,
          color: getTrackColor(
            Object.assign(child, { parent: entry }),
            colorDomainsBy
          ),
          location2residue: child.location2residue,
          // expanded: true,
        })),
      }
    : {};

const TracksInCategory = ({
  entries,
  sequence,
  hideCategory,
  highlightColor,
  popperRef,
}: Props) => {
  const [expandedTrack, setExpandedTrack, expandedTrackRef] = useStateRef<
    Record<string, boolean>
  >({});
  const [overPopup, setOverPopup, overPopupRef] = useStateRef(false);
  const [hasListeners, setHasListeners] = useState<Record<string, boolean>>({});
  const handleTrackEvent = ({ detail }: { detail: DetailInterface }) => {
    const accession = detail.feature?.accession;
    if (detail && accession) {
      switch (detail.eventType) {
        case 'click':
          setExpandedTrack({
            ...expandedTrackRef.current,
            [accession]: !expandedTrackRef.current[accession],
          });
          break;
        // case 'mouseout':
        //   const [clear] = useInterval(() => {
        //     if (overPopupRef.current) return;
        //     clear();
        //     // popper.destroy();
        //     if (this._popperRef.current)
        //       this._popperRef.current.classList.add(css('hide'));
        //     timeoutID = null;
        //   }, TOOLTIP_DELAY);
        //   break;
        // case 'mouseover':
        //   if (this.state.enableTooltip) {
        //     if (this._timeoutID !== null) {
        //       clearInterval(this._timeoutID);
        //     }
        //     if (this._popperRef.current)
        //       this._popperRef.current.classList.remove(f('hide'));
        //     const sourceDatabase = this._getSourceDatabaseDisplayName(
        //       detail.feature,
        //       this.props?.dataDB?.payload?.databases,
        //     );
        //     if (this._popperContentRef.current) {
        //       // eslint-disable-next-line max-depth
        //       if (!this.reactRoot)
        //         this.reactRoot = createRoot(this._popperContentRef.current);

        //       this.reactRoot.render(
        //         <ProtVistaPopup
        //           detail={detail}
        //           sourceDatabase={sourceDatabase}
        //           data={this.props.data}
        //           currentLocation={this.props.customLocation}
        //           // Need to pass it from here because it rendered out of the redux provider
        //           goToCustomLocation={this.props.goToCustomLocation}
        //         />,
        //       );
        //     }

        //     this._isPopperTop = !this._isPopperTop;
        //     if (this._popperRef.current) {
        //       this.popper = new PopperJS(
        //         detail.target,
        //         this._popperRef.current,
        //         {
        //           applyStyle: { enabled: false },
        //           modifiers: {
        //             preventOverflow: {
        //               boundariesElement: this._protvistaRef?.current || window,
        //               priority: ['left', 'right'],
        //             },
        //           },
        //         },
        //       );
        //     }
        //   }
        //   break;
        default:
          break;
      }
    }
  };
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
        for (let entry of entries) {
          if (!hasListeners[entry.accession]) {
            const track = document.getElementById(`track_${entry.accession}`);
            if (track) {
              track.addEventListener(
                'change',
                (
                  evt //console.log(expandedTrack)
                ) => handleTrackEvent({ detail: (evt as CustomEvent).detail })
              );
              addedListeners[entry.accession || ''] = true;
            }
          }
        }
        setHasListeners({
          ...hasListeners,
          ...addedListeners,
        });
      }
    );
  }, [entries]);
  // console.log(popperRef.current);
  return (
    <>
      {/* {popperRef.current !== null &&
        createPortal(<p>Hello from React!</p>, popperRef.current)} */}
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
                          display-start={1}
                          display-end={sequence.length}
                          type="conservation"
                          id={`track_${entry.accession}`}
                          // ref={(e) =>
                          //   (this.web_tracks[getUIDFromEntry(entry)] = e)
                          // }
                          margin-color="#fafafa"
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          use-ctrl-to-zoom
                        />
                      )}
                    {entry.type === 'confidence' && (
                      <NightingaleColoredSequence
                        // ref={(e) =>
                        //   (this.web_tracks[entry.accession] = e)
                        // }
                        id={`track_${entry.accession}`}
                        data={entry.data as string}
                        length={sequence.length}
                        display-start={1}
                        display-end={sequence.length}
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
                        data={mapToFeatures(entry, 'ACCESSION')}
                        {...mapToContributors(entry, 'ACCESSION')}
                        display-start={1}
                        display-end={sequence.length}
                        margin-color="#fafafa"
                        height={15}
                        id={`track_${entry.accession}`}
                        // ref={(e) =>
                        //   (this.web_tracks[getUIDFromEntry(entry)] = e)
                        // }
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        use-ctrl-to-zoom
                      />
                    )}{' '}
                  </div>
                ) : (
                  <NightingaleInterProTrack
                    length={sequence.length}
                    display-start={1}
                    display-end={sequence.length}
                    margin-color="#fafafa"
                    data={mapToFeatures(entry, 'ACCESSION')}
                    {...mapToContributors(entry, 'ACCESSION')}
                    id={`track_${entry.accession}`}
                    // ref={(e) =>
                    //   (this.web_tracks[getUIDFromEntry(entry)] =
                    //     e)
                    // }
                    shape="roundRectangle"
                    highlight-event="onmouseover"
                    highlight-color={highlightColor}
                    show-label
                    label=".feature.short_name"
                    use-ctrl-to-zoom
                    expanded={!!expandedTrack[entry.accession]}
                    // onClick={(event: React.MouseEvent) => {
                    //   const classList = (event.target as HTMLElement).classList;
                    //   if (
                    //     !classList.contains('feature') ||
                    //     classList.contains('child-fragment') ||
                    //     classList.contains('residue')
                    //   )
                    //     return; //Don't do anything for child features
                    //   console.log(event);
                    //   setExpandedTrack({
                    //     ...expandedTrack,
                    //     [entry.accession]: !expandedTrack[entry.accession],
                    //   });
                    // }}
                    // onMouseOver={handleMouseOver}
                    // onMouseOut={handleMouseOut}
                    // onChange={handleChange}
                  />
                )}
              </div>
              <LabelsInTrack
                entry={entry}
                hideCategory={hideCategory}
                expandedTrack={!!expandedTrack[entry.accession]}
                isPrinting={false}
              />
            </React.Fragment>
          );
        })}
    </>
  );
};

export default TracksInCategory;
