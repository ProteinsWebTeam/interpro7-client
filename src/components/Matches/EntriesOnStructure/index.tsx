import React from 'react';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { location2html } from 'utils/text';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';
import { GenericMatch } from '../MatchesByPrimary';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

type Props = { match: GenericMatch; matches: Array<AnyMatch> };

const EntriesOnStructure = ({ matches, match }: Props) => {
  const { entry, structure } = match || {};
  if (!matches.length || !entry || !structure) return null;

  return (
    <section>
      <table>
        <tbody>
          {matches.map((m) => {
            const length = m.sequence_length || 0;
            const sequence = m.sequence || '\u00A0'.repeat(length);
            const data = [
              {
                accession: entry.accession,
                name: entry.name,
                // short_name: entry.short_name,
                source_database: entry.source_database,
                locations: m.entry_structure_locations || [],
                color: getTrackColor(entry, EntryColorMode.ACCESSION),
                entry_type: entry.entry_type,
                type: 'entry',
              },
            ];
            return (
              <tr>
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
                      <Tooltip
                        title={location2html(
                          m.entry_structure_locations || [],
                          structure.accession,
                          (structure?.name as NameObject)?.name
                            ? (structure?.name as NameObject).name
                            : structure.name
                        )}
                      >
                        <NightingaleInterProTrack
                          length={length}
                          display-start={1}
                          display-end={length}
                          margin-color="#fafafa"
                          id={`track_${structure.accession}`}
                          // ref={(e) => (this.web_tracks[structure.accession] = e)}
                          shape="roundRectangle"
                          data={data || []}
                          expanded
                          use-ctrl-to-zoom
                        />
                      </Tooltip>
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
