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

const StructureOnProtein = ({ matches, match }: Props) => {
  const [data, setData] = useState<Record<string, Array<Feature>> | null>(null);
  const [locationHovered, setLocationHovered] = useState<
    Array<ProtVistaLocation>
  >([]);
  const { structure, protein } = match || {};
  useEffect(() => {
    if (!matches.length || !protein || !structure) return;

    setData(
      Object.fromEntries(
        matches.map((m) => [
          m.chain,
          [
            {
              accession: structure.accession,
              name: structure.name,
              source_database: structure.source_database,
              locations: (m.structure_protein_locations || []).map(
                ({ fragments }) => {
                  return {
                    fragments: fragments.map(
                      ({ protein_start, protein_end }) => {
                        return {
                          start: protein_start,
                          end: protein_end,
                        };
                      },
                    ),
                  };
                },
              ),
              color: getTrackColor(structure, EntryColorMode.ACCESSION),
              type: 'structure',
              entry_type: 'chain',
            },
          ],
        ]),
      ),
    );
  }, [protein, structure]);

  if (!matches.length || !structure || !protein) return null;
  const length = protein.length || 0;
  const sequence = protein.sequence || '\u00A0'.repeat(length);
  return (
    <section>
      <table className={css('matches-in-table')}>
        <tbody>
          {matches.map((m) => {
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
                            accession={structure.accession}
                            dbName={structure.source_database}
                            name={
                              (structure?.name as NameObject)?.short ||
                              (structure?.name as NameObject)?.name ||
                              (structure.name as string) ||
                              ''
                            }
                          />
                        }
                        onMouseOverFeature={(
                          locations: Array<ProtVistaLocation>,
                        ) => {
                          setLocationHovered(locations);
                        }}
                      >
                        <NightingaleInterProTrack
                          data={data?.[m.chain || ''] || []}
                          length={length}
                          display-start={1}
                          display-end={length}
                          margin-color="#fafafa"
                          id={`track_${structure.accession}_${m.chain}`}
                          shape="rectangle"
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

export default StructureOnProtein;
