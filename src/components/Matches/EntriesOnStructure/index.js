/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';
import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entryColor';

class EntriesOnStructure extends ProtVistaMatches {
  static propTypes = {
    matches: T.arrayOf(
      T.shape({
        structure: T.object.isRequired,
        entry: T.object.isRequired,
      }),
    ).isRequired,
    options: T.object,
  };
  updateTracksWithData({ matches: data }) {
    if (data.length > 1) {
      console.error(
        'There are several matches and this component is using only one',
      );
      console.table(data);
    }
    const structure = data[0].structure;
    const entry = data[0].entry;
    const main = 'entry_protein_locations' in structure ? 'structure' : 'entry';

    const firstMatch = data[0];
    const {
      [main]: {
        entry_protein_locations: locationsEP,
        protein_structure_locations: locationsPS,
        protein_length: length,
      },
    } = firstMatch;
    const strData = locationsPS.map(loc => ({
      accession: structure.accession,
      name: structure.name,
      source_database: structure.source_database,
      locations: [loc],
      color: getTrackColor(structure, EntryColorMode.ACCESSION),
      type: 'structure',
    }));
    const entryData = locationsEP.map(loc => ({
      accession: entry.accession,
      name: entry.name,
      source_database: entry.source_database,
      locations: [loc],
      color: getTrackColor(entry, EntryColorMode.ACCESSION),
      entry_type: entry.entry_type,
      type: 'entry',
    }));

    this.web_tracks[structure.accession].data = strData;
    this.web_tracks[entry.accession].data = entryData;
    if (!this.web_protein.data) this.web_protein.data = ' '.repeat(length);
  }

  render() {
    const { matches } = this.props;
    const structure = matches[0].structure;
    const entry = matches[0].entry;
    const main = 'entry_protein_locations' in structure ? 'structure' : 'entry';
    const length = matches[0][main].protein_length;

    return (
      <div className={f('track-in-table')}>
        <protvista-manager
          attributes="length displaystart displayend highlightstart highlightend"
          id="pv-manager"
        >
          <div className={f('track-container')}>
            <div className={f('aligned-to-track-component')}>
              <protvista-sequence
                ref={e => (this.web_protein = e)}
                length={length}
                displaystart="1"
                displayend={length}
              />
            </div>
          </div>
          <div className={f('track-component')}>
            <protvista-interpro-track
              length={length}
              displaystart="1"
              displayend={length}
              id={`track_${structure.accession}`}
              ref={e => (this.web_tracks[structure.accession] = e)}
              shape="rectangle"
              expanded
            />
          </div>
          <div className={f('track-component')}>
            <protvista-interpro-track
              length={length}
              displaystart="1"
              displayend={length}
              id={`track_${entry.accession}`}
              ref={e => (this.web_tracks[entry.accession] = e)}
              shape="roundRectangle"
              expanded
            />
          </div>
        </protvista-manager>
      </div>
    );
  }
}

export default EntriesOnStructure;

// const EntriesOnStructure = ({
//   matches,
//   options: { baseSize = 10, offset = 30, niceRatio = 6 } = {},
// }) => {
//   const structure = matches[0].structure;
//   const main = 'entry_protein_locations' in structure ? 'structure' : 'entry';
//   const length = matches[0][main].protein_length;
//   console.table(matches);
//   return (
//     <div className={style.svgContainer}>
//       <svg
//         className={style.svg}
//         preserveAspectRatio="xMinYMid meet"
//         viewBox={`0 0 ${length + offset} 60`}
//         width={length}
//       >
//         <g transform={`translate(0 ${offset - baseSize / 2})`}>
//           <rect
//             x="0"
//             y="0"
//             rx={baseSize / niceRatio}
//             width={length}
//             height={baseSize}
//             className={style.primary}
//           />
//           <text y="-0.2em" transform={`translate(${length} 0)`}>
//             <tspan textAnchor="end">{length}</tspan>
//           </text>
//         </g>
//         <g>
//           {matches.map(
//             ({ [main]: { entry_protein_locations: locations }, entry }) =>
//               locations.map((location, i) =>
//                 location.fragments.map((fragment, j) => (
//                   <g
//                     key={`${entry.accession}-${i}-${j}`}
//                     transform={`translate(${fragment.start} ${offset -
//                       baseSize / 2})`}
//                   >
//                     <title>{entry.accession}</title>
//                     <rect
//                       x="0"
//                       y="0"
//                       rx={baseSize / niceRatio}
//                       width={fragment.end - fragment.start}
//                       height={baseSize}
//                       fill={colorHash.hex(entry.accession)}
//                       className={style.secondary}
//                     />
//                     <text y="-0.2em">
//                       <tspan textAnchor="middle">{fragment.start}</tspan>
//                     </text>
//                     <text
//                       y="-0.2em"
//                       transform={`translate(${fragment.end -
//                         fragment.start} 0)`}
//                     >
//                       <tspan textAnchor="middle">{fragment.end}</tspan>
//                     </text>
//                   </g>
//                 )),
//               ),
//           )}
//         </g>
//         <g>
//           {matches.map(
//             ({ [main]: { protein_structure_locations: locations } }) =>
//               locations.map((location, i) =>
//                 location.fragments.map((fragment, j) => (
//                   <g
//                     key={`${structure.accession}-${i}-${j}`}
//                     transform={`translate(${fragment.start} ${offset -
//                       baseSize})`}
//                   >
//                     <title>{structure.accession}</title>
//                     <rect
//                       x="0"
//                       y="0"
//                       rx={baseSize * 2 / niceRatio}
//                       width={fragment.end - fragment.start}
//                       height={baseSize * 2}
//                       fill="rgba(30,10,10,0.2)"
//                       stroke="#343"
//                       strokeWidth="2px"
//                       className={style.secondary}
//                     />
//                     <text y="-0.2em">
//                       <tspan textAnchor="middle">{fragment.start}</tspan>
//                     </text>
//                     <text
//                       y="-0.2em"
//                       transform={`translate(${fragment.end -
//                         fragment.start} 0)`}
//                     >
//                       <tspan textAnchor="middle">{fragment.end}</tspan>
//                     </text>
//                   </g>
//                 )),
//               ),
//           )}
//         </g>
//       </svg>
//     </div>
//   );
// };
