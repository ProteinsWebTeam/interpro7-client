/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';
import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entryColor';

const webComponents = [];

class StructureOnProtein extends ProtVistaMatches {
  static propTypes = {
    matches: T.arrayOf(
      T.shape({
        structure: T.object.isRequired,
        protein: T.object.isRequired,
      }),
    ).isRequired,
    options: T.object,
  };
  updateTracksWithData(data) {
    const protein = data[0].protein;
    const main = 'entry_protein_locations' in protein ? 'protein' : 'structure';
    const firstMatch = data[0];
    const { [main]: { protein_structure_locations: locations } } = firstMatch;
    // let locations = [];
    // if (firstMatch.entry && firstMatch.entry.entry_protein_locations)
    //   locations = firstMatch.entry.entry_protein_locations;
    // else if (firstMatch.protein && firstMatch.protein.entry_protein_locations)
    //   locations = firstMatch.protein.entry_protein_locations;
    const d = data[0].structure;
    const tmp = locations.map(loc => ({
      accession: d.accession,
      name: d.name,
      source_database: d.source_database,
      locations: [loc],
      color: getTrackColor(d, EntryColorMode.ACCESSION),
      type: 'structure',
    }));

    this.web_tracks[d.accession].data = tmp;
  }

  render() {
    const { matches } = this.props;
    console.log(matches);
    const protein = matches[0].protein;
    const structure = matches[0].structure;
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
                length={protein.length}
                displaystart="1"
                displayend={protein.length}
              />
            </div>
          </div>
          <div className={f('track-component')}>
            <protvista-interpro-track
              length={protein.length}
              displaystart="1"
              displayend={protein.length}
              id={`track_${structure.accession}`}
              ref={e => (this.web_tracks[structure.accession] = e)}
              shape="roundRectangle"
              expanded
            />
          </div>
        </protvista-manager>
      </div>
    );
  }

  // render() {
  //   const {
  //     matches,
  //     options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  //   } = this.props;
  //   const protein = matches[0].protein;
  //   const main = 'entry_protein_locations' in protein ? 'protein' : 'structure';
  //   return (
  //     <div className={style.svgContainer}>
  //       <svg
  //         className={style.svg}
  //         preserveAspectRatio="xMinYMid meet"
  //         viewBox={`0 0 ${protein.length + offset} 60`}
  //       >
  //         <g transform={`translate(0 ${offset - baseSize / 2})`}>
  //           <title>{protein.accession}</title>
  //           <rect
  //             x="0"
  //             y="0"
  //             rx={baseSize / niceRatio}
  //             width={protein.length}
  //             height={baseSize}
  //             className={style.primary}
  //           />
  //           <text
  //             x="0.1em"
  //             y="0.8em"
  //             transform={`translate(${protein.length} 0)`}
  //           >
  //             <tspan>{protein.length}</tspan>
  //           </text>
  //         </g>
  //         <g>
  //           {matches.map(match => {
  //             const {
  //               [main]: {protein_structure_locations: locations},
  //               structure,
  //             } = match;
  //             return locations.map((location, i) =>
  //               location.fragments.map((fragment, j) => (
  //                 <g
  //                   key={`${structure.accession}-${i}-${j}`}
  //                   transform={`translate(${fragment.start} ${offset -
  //                   baseSize})`}
  //                 >
  //                   <title>{structure.accession}</title>
  //                   <rect
  //                     x="0"
  //                     y="0"
  //                     rx={baseSize * 2 / niceRatio}
  //                     width={fragment.end - fragment.start}
  //                     fill={colorHash.hex(structure.accession)}
  //                     height={baseSize * 2}
  //                     className={style.secondary}
  //                   />
  //                   <text y="-0.2em">
  //                     <tspan textAnchor="middle">{fragment[0]}</tspan>
  //                   </text>
  //                   <text
  //                     y="-0.2em"
  //                     transform={`translate(${fragment.end - fragment.start} 0)`}
  //                   >
  //                     <tspan textAnchor="middle">{fragment[1]}</tspan>
  //                   </text>
  //                 </g>
  //               )),
  //             );
  //           })}
  //         </g>
  //       </svg>
  //     </div>
  //   );
  // }
}

export default StructureOnProtein;
