import React, { useState, useEffect } from 'react';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import TooltipForTrack from 'components/SimpleCommonComponents/Tooltip/ForTrack';
import EntryPopup from 'components/SimpleCommonComponents/Tooltip/EntryPopup';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';
import { GenericMatch, Feature } from '../MatchesByPrimary';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

type Props = { match: GenericMatch; matches: Array<AnyMatch> };

const EntriesOnStructure = ({ matches, match }: Props) => {
  const [data, setData] = useState<Record<string, Array<Feature>> | null>(null);
  const [locationHovered, setLocationHovered] = useState<Array<ProtVistaLocation>>([]);
  const { entry, structure } = match || {};

  useEffect(() => {
    if (!matches.length || !entry || !structure) return;

    setData(Object.fromEntries(
      matches.map((m) => ([m.chain, [{
        accession: entry.accession,
        name: entry.name,
        // short_name: entry.short_name,
        source_database: entry.source_database,
        locations: m.entry_structure_locations || [],
        color: getTrackColor(entry, EntryColorMode.ACCESSION),
        entry_type: entry.entry_type,
        type: 'entry',
      }]])))
    );
  }, [entry, structure]);


  if (!matches.length || !entry || !structure) return null;

  return (
    <section>
      <table className={css('matches-in-table')}>
        <tbody>
          {matches.map((m) => {
            const length = m.sequence_length || 0;
            const sequence = m.sequence || '\u00A0'.repeat(length);
            return (
              <tr key={m.chain}>
                {m.chain ? <td>{m.chain}</td> : null}
                <td>
                  <div className={css('track-in-table')}>
                    <div className={css('track-container')}>
                      <div className={css('aligned-to-track-component')}>
                        <NightingaleSequence
                          length={length}
                          sequence={sequence}
                          display-start={1}
                          display-end={length}
                          height={30}
                          use-ctrl-to-zoom
                        />
                      </div>
                    </div>

                    <div className={css('track-component')}>
                      <TooltipForTrack
                        message={
                          <EntryPopup
                            locations={locationHovered}
                            accession={entry.accession}
                            dbName={entry.source_database}
                            name={(entry?.name as NameObject)?.short || (entry.name as string) || ''}
                          />
                        }
                        onMouseOverFeature={(locations: Array<ProtVistaLocation>) => {
                          setLocationHovered(locations)
                        }}
                      >
                        <NightingaleInterProTrack
                          length={length}
                          display-start={1}
                          display-end={length}
                          margin-color="#fafafa"
                          id={`track_${structure.accession}`}
                          shape="roundRectangle"
                          data={data?.[m.chain || ''] || []}
                          expanded
                          use-ctrl-to-zoom
                        />
                      </TooltipForTrack>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default EntriesOnStructure;
