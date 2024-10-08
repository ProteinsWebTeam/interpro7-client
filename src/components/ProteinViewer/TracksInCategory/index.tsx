import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import useStateRef from 'utils/hooks/useStateRef';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import { LineData } from '@nightingale-elements/nightingale-linegraph-track';
import NightingaleInterProTrackCE from '@nightingale-elements/nightingale-interpro-track';

import NightingaleTrack from 'components/Nightingale/Track';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleLinegraphTrack from 'components/Nightingale/Linegraph';
import NightingaleColoredSequence from 'components/Nightingale/ColoredSequence';
import NightingaleVariation from 'components/Nightingale/Variation';
import uniqueId from 'utils/cheap-unique-id';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';
import grid from '../grid.css';
import { ExtendedFeature } from '..';
import LabelsInTrack from '../LabelsInTrack';

import ProtVistaPopup, { PopupDetail } from '../Popup';
import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';

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
  'consensus majority',
  'variation',
];

const MARGIN_CHANGE_TRACKS = [
  'coiled-coils,_signal_peptides,_transmembrane_regions',
  'short_linear_motifs',
  'pfam-n',
  'funfam',
  'match_conservation',
];

const EXCEPTIONAL_PREFIXES = ['G3D:', 'REPEAT:', 'DISPROT:'];

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
    integrated: entry.integrated,
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
    integrated: child.integrated,
    locations: (child.entry_protein_locations || child.locations || []).map(
      (loc) => ({
        ...loc,
        fragments: loc.fragments.map((f) => ({
          shape: b2sh.get(
            (f as unknown as { 'dc-status': string })['dc-status'],
          ),
          ...f,
        })),
      }),
    ),
    parent: entry,
    color: getTrackColor(
      Object.assign(child, { parent: entry }),
      colorDomainsBy,
    ),
    location2residue: child.location2residue,
    // expanded: true,
  }));
export type ExpandedHandle = {
  setExpandedAllTracks: (v: boolean) => void;
};
type Props = {
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  isPrinting: boolean;
  openTooltip: (element: HTMLElement | undefined, content: ReactNode) => void;
  closeTooltip: () => void;
  sequence: string;
  customLocation?: InterProLocation;
  colorDomainsBy?: string;
  databases?: DBsInfo;
};
const TracksInCategory = forwardRef<ExpandedHandle, Props>(
  (
    {
      entries,
      sequence,
      hideCategory,
      isPrinting,
      highlightColor,
      customLocation,
      openTooltip,
      closeTooltip,
      colorDomainsBy,
      databases,
    },
    ref,
  ) => {
    const [expandedTrack, setExpandedTrack, expandedTrackRef] = useStateRef<
      Record<string, boolean>
    >({});
    const [hasListeners, setHasListeners] = useState<Record<string, boolean>>(
      {},
    );
    const [hasData, setHasData] = useState<Record<string, boolean>>({});
    const databasesRef = useRef<DBsInfo | null>(null);
    const uniqueID = useRef(uniqueId());
    const getTrackAccession = (accession: string) =>
      `track_${uniqueID.current}_${accession}`;
    useEffect(() => {
      if (databases) databasesRef.current = databases;
    }, [databases]);
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
          case 'mouseover': {
            const sourceDatabase =
              databasesRef.current?.[detail.feature?.source_database || '']
                ?.name ||
              detail.feature?.source_database ||
              '';
            if (customLocation) {
              openTooltip(
                detail.target,
                <ProtVistaPopup
                  detail={detail as unknown as PopupDetail}
                  sourceDatabase={sourceDatabase}
                  currentLocation={customLocation}
                />,
              );
            }
            break;
          }
          default:
            break;
        }
      }
    };

    useEffect(() => {
      setHasData({}); // Forcing reload of the data
    }, [colorDomainsBy]);

    const setExpandedAllTracks = (expanded: boolean) => {
      setExpandedTrack(
        Object.fromEntries(
          entries
            .filter((entry) => !OTHER_TRACK_TYPES.includes(entry.type || ''))
            .map((entry) => [entry.accession, expanded]),
        ),
      );
    };
    useImperativeHandle(ref, () => ({ setExpandedAllTracks }), []);
    useEffect(() => {
      setExpandedAllTracks(true);
      Promise.all(
        webComponents.map((wc) => customElements.whenDefined(wc)),
      ).then(() => {
        const addedListeners: Record<string, boolean> = {};
        const addedData: Record<string, boolean> = {};
        for (const entry of entries) {
          const track = document.getElementById(
            getTrackAccession(entry.accession),
          );
          if (track) {
            // setting up the listeners
            if (!hasListeners[entry.accession]) {
              track.addEventListener('change', (evt) =>
                handleTrackEvent({ detail: (evt as CustomEvent).detail }),
              );
              addedListeners[entry.accession || ''] = true;
            }
            // adding the data
            if (!hasData[entry.accession]) {
              if (
                ['nightingale-track', 'nightingale-interpro-track'].includes(
                  track.tagName.toLowerCase(),
                )
              ) {
                (track as NightingaleInterProTrackCE).data = mapToFeatures(
                  entry,
                  colorDomainsBy || 'ACCESSION',
                );
                const contributors = mapToContributors(
                  entry,
                  colorDomainsBy || 'ACCESSION',
                );
                if (contributors)
                  (track as NightingaleInterProTrackCE).contributors =
                    contributors;
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
      });
    }, [entries, hasData]);

    return (
      <>
        {entries &&
          entries.map((entry) => {
            const type = entry.type || '';
            const isExternalSource = EXCEPTIONAL_PREFIXES.some((prefix) =>
              entry.accession.startsWith(prefix),
            );

            // Space unintegrated tracks
            const trackTopMargin =
              entry.source_database !== 'interpro' && // Not integrated
              !MARGIN_CHANGE_TRACKS.includes(entry.source_database || '') && // Not included in other_features (eg. pfam-n, etc..)
              !entry.accession.startsWith('residue:') // Not a residue
                ? 14
                : 2;

            return (
              <React.Fragment key={entry.accession}>
                <div
                  className={css('track', {
                    hideCategory,
                  })}
                >
                  {OTHER_TRACK_TYPES.includes(type) || isExternalSource ? (
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
                            id={getTrackAccession(entry.accession)}
                            margin-color="#fafafa"
                            margin-left={20}
                            highlight-event="onmouseover"
                            highlight-color={highlightColor}
                            use-ctrl-to-zoom
                          />
                        )}
                      {entry.type === 'confidence' && (
                        <NightingaleColoredSequence
                          id={getTrackAccession(entry.accession)}
                          data={entry.data as string}
                          length={sequence.length}
                          scale="H:90,M:70,L:50,D:0"
                          height={12}
                          color-range="#ff7d45:0,#ffdb13:50,#65cbf3:70,#0053d6:90,#0053d6:100"
                          margin-right={10}
                          margin-left={20}
                          margin-color="#fafafa"
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          className="confidence"
                          use-ctrl-to-zoom
                        />
                      )}
                      {entry.type === 'ptm' && (
                        <></>
                        /*<NightingaleColoredSequence
                          id={getTrackAccession(entry.accession)}
                          data={entry.data as string}
                          length={sequence.length}
                          scale="H:90,M:70,L:50,D:0"
                          height={12}
                          color-range="#ff7d45:0,#ffdb13:50,#65cbf3:70,#0053d6:90,#0053d6:100"
                          margin-right={10}
                          margin-left={20}
                          margin-color="#fafafa"
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          className="confidence"
                          use-ctrl-to-zoom
                        />*/
                      )}
                      {entry.type === 'variation' && (
                        <NightingaleVariation
                          id={getTrackAccession(entry.accession)}
                          data={entry.data as ProteinsAPIVariation}
                          length={sequence.length}
                          row-height={14}
                          margin-color="#fafafa"
                          margin-left={20}
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          className="variation"
                          use-ctrl-to-zoom
                          colorConfig={() => '#990000'}
                          condensed-view
                          protein-api
                        />
                      )}
                      {(['secondary_structure', 'residue'].includes(
                        entry.type || '',
                      ) ||
                        isExternalSource) && (
                        <NightingaleTrack
                          length={sequence.length}
                          margin-color="#fafafa"
                          margin-left={20}
                          height={15}
                          id={getTrackAccession(entry.accession)}
                          highlight-event="onmouseover"
                          highlight-color={highlightColor}
                          use-ctrl-to-zoom
                        />
                      )}{' '}
                    </div>
                  ) : (
                    <>
                      <NightingaleInterProTrack
                        length={sequence.length}
                        margin-color="#fafafa"
                        id={getTrackAccession(entry.accession)}
                        show-label
                        margin-left={20}
                        margin-top={trackTopMargin} // Space unintegrated
                        // @ts-ignore
                        samesize={true}
                        shape="roundRectangle"
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        label=".feature.short_name"
                        use-ctrl-to-zoom
                        expanded={expandedTrack[entry.accession]}
                      />
                    </>
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
  },
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.ui,
  (customLocation: InterProLocation, ui: Record<string, unknown>) => ({
    customLocation,
    colorDomainsBy:
      (ui.colorDomainsBy as string) || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);
export default connect(mapStateToProps, null, null, {
  forwardRef: true,
})(TracksInCategory);
