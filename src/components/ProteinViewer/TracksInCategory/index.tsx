import React, { useState, useEffect } from 'react';
import cssBinder from 'styles/cssBinder';
import { LineData } from '@nightingale-elements/nightingale-linegraph-track';

import NightingaleTrack from 'components/Nightingale/InterProTrack';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleLinegraphTrack from 'components/Nightingale/Linegraph';
import NightingaleColoredSequence from 'components/Nightingale/ColoredSequence';
// import NightingaleSequence from 'components/Nightingale/Sequence';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';
import { ExtendedFeature, ExtendedFeatureLocation } from '..';
import LabelsInTrack from '../LabelsInTrack';

const css = cssBinder(style, grid);

type Props = {
  entries: Array<ExtendedFeature>;
  highlightColor: string;
  hideCategory: boolean;
  sequence: string;
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
}: Props) => {
  const [expandedTrack, setExpandedTrack] = useState<Record<string, boolean>>(
    {}
  );
  useEffect(() => {
    setExpandedTrack(
      Object.fromEntries(
        entries
          .filter((entry) => !OTHER_TRACK_TYPES.includes(entry.type || ''))
          .map((entry) => [entry.accession, true])
      )
    );
  }, [entries]);
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
                          display-start={1}
                          display-end={sequence.length}
                          type="conservation"
                          // id={`track_${entry.accession}`}
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
                        // id={`track_${entry.accession}`}
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
                    // id={`track_${entry.accession}`}
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
                    onClick={() =>
                      setExpandedTrack({
                        ...expandedTrack,
                        [entry.accession]: !expandedTrack[entry.accession],
                      })
                    }
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
