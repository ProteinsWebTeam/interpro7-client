/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';
import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

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
  updateTracksWithData({ matches: data }) {
    if (data.length > 1) {
      console.error(
        'There are several matches and this component is using only one',
      );
      console.table(data);
    }
    const firstMatch = data[0];
    const { structure, protein } = firstMatch;
    const main = 'entry_protein_locations' in protein ? 'protein' : 'structure';
    const {
      [main]: { protein_structure_locations: locations },
    } = firstMatch;
    if (!this.web_protein.data)
      this.web_protein.data = protein.sequence || ' '.repeat(protein.length);

    const tmp = locations.map(loc => ({
      accession: structure.accession,
      name: structure.name,
      source_database: structure.source_database,
      locations: [loc],
      color: getTrackColor(structure, EntryColorMode.ACCESSION),
      type: 'structure',
    }));

    this.web_tracks[structure.accession].data = tmp;
  }

  render() {
    const { matches } = this.props;
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
              shape="rectangle"
              expanded
            />
          </div>
        </protvista-manager>
      </div>
    );
  }
}

export default StructureOnProtein;
