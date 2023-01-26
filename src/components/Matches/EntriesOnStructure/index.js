// TODO: check if we can replace that file with
// TODO: 'components/Related/DomainEntriesOnStructure'
/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';
import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { location2html } from 'utils/text';

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
      console.error('This component expects exactly 1 match but recieved more');
      console.table(data);
    }
    const structure = data[0].structure;
    const entry = data[0].entry;
    const main = 'entry_protein_locations' in structure ? 'structure' : 'entry';

    const firstMatch = data[0];
    const {
      [main]: {
        entry_protein_locations: locationsEP,
        structure_protein_locations: locationsPS,
        protein_length: length,
      },
    } = firstMatch;
    const strData = locationsPS.map((loc) => ({
      accession: structure.accession,
      name: structure.name,
      source_database: structure.source_database,
      locations: [loc],
      color: getTrackColor(structure, EntryColorMode.ACCESSION),
      type: 'structure',
    }));
    const entryData = locationsEP.map((loc) => ({
      accession: entry.accession,
      name: entry.name,
      short_name: entry.short_name,
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
        <div className={f('track-container')}>
          <div className={f('aligned-to-track-component')}>
            <nightingale-sequence
              ref={(e) => (this.web_protein = e)}
              length={length}
              displaystart="1"
              displayend={length}
              height="30"
              use-ctrl-to-zoom
            />
          </div>
        </div>
        <div className={f('track-component')}>
          <Tooltip
            title={location2html(
              structure.structure_protein_locations ||
                entry.structure_protein_locations,
              structure.accession,
              structure.name.name ? structure.name.name : structure.name,
            )}
          >
            <nightingale-interpro-track
              length={length}
              display-start="1"
              display-end={length}
              id={`track_${structure.accession}`}
              ref={(e) => (this.web_tracks[structure.accession] = e)}
              shape="rectangle"
              expanded
              use-ctrl-to-zoom
            />
          </Tooltip>
        </div>
        <div className={f('track-component')}>
          <Tooltip
            title={location2html(
              entry.entry_protein_locations ||
                structure.entry_protein_locations,
              entry.accession,
              entry.name.name ? entry.name.name : entry.name,
            )}
          >
            <nightingale-interpro-track
              length={length}
              display-start="1"
              display-end={length}
              id={`track_${entry.accession}`}
              ref={(e) => (this.web_tracks[entry.accession] = e)}
              shape="roundRectangle"
              expanded
              use-ctrl-to-zoom
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default EntriesOnStructure;
