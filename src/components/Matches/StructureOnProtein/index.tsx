import React from 'react';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';

import { GenericMatch, Feature } from '../MatchesByPrimary';
import { location2html } from 'utils/text';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

type Props = { match: GenericMatch; matches: Array<AnyMatch> };


const StructureOnProtein = ({ matches, match }: Props) => {
  const { structure, protein } = match || {};
  if (!matches.length || !structure || !protein) return null;
  const length = protein.length || 0;
  const sequence = protein.sequence || '\u00A0'.repeat(length);

  return (
    <section>
      <table>
        <tbody>
          {matches.map((m) => {
            const data: Feature[] = [
              {
                accession: structure.accession,
                name: structure.name,
                source_database: structure.source_database,
                locations: m.structure_protein_locations || [],
                color: getTrackColor(structure, EntryColorMode.ACCESSION),
                type: 'structure',
                entry_type: 'chain',
              }
            ];
            return (
              <tr key={m.chain}>
                {m.chain ? <td>{m.chain}</td> : null}
                <td>    <div className={css('track-in-table')}>
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
                        m.structure_protein_locations || [],
                        structure.accession,
                        (structure?.name as NameObject)?.name
                          ? (structure?.name as NameObject).name
                          : structure.name
                      )}
                    >
                      <NightingaleInterProTrack
                        data={data || []}
                        length={length}
                        display-start={1}
                        display-end={length}
                        margin-color="#fafafa"
                        id={`track_${structure.accession}_${m.chain}`}
                        shape="rectangle"
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
}

export default StructureOnProtein;
