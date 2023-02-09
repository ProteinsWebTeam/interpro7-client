/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';
import { location2html } from 'utils/text';
import { EntryColorMode, getTrackColor } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

const f = foundationPartial(protvista);

class EntriesOnProtein extends ProtVistaMatches {
  static propTypes = {
    matches: T.arrayOf(
      T.shape({
        protein: T.object.isRequired,
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
    const firstMatch = data[0];
    const { entry, protein } = firstMatch;
    let locations = [];
    if (firstMatch.entry && firstMatch.entry.entry_protein_locations)
      locations = firstMatch.entry.entry_protein_locations;
    else if (firstMatch.protein && firstMatch.protein.entry_protein_locations)
      locations = firstMatch.protein.entry_protein_locations;
    this.web_tracks[entry.accession].data = locations.map((loc) => ({
      accession: entry.accession,
      name: entry.name,
      source_database: entry.source_database,
      locations: [loc],
      color: getTrackColor(entry, EntryColorMode.ACCESSION),
      entry_type: entry.entry_type,
      type: 'entry',
    }));

    if (!this.web_protein.data)
      this.web_protein.data =
        protein.sequence || '\u00A0'.repeat(protein.length);
  }

  render() {
    const { matches } = this.props;
    const protein = matches[0].protein;
    const entry = matches[0].entry;
    return (
      <div className={f('track-in-table')}>
        {/* <SchemaOrgData data={matches[0]} processData={schemaProcessData} />*/}
        <div className={f('track-container')}>
          <div className={f('aligned-to-track-component')}>
            <nightingale-sequence
              ref={(e) => (this.web_protein = e)}
              length={protein.length}
              display-start="1"
              display-end={protein.length}
              height="30"
              use-ctrl-to-zoom
            />
          </div>
        </div>
        <div className={f('track-component')}>
          <Tooltip
            title={location2html(
              entry.entry_protein_locations || protein.entry_protein_locations,
              entry.accession,
              entry?.name?.name || entry?.name?.short || entry.name,
            )}
          >
            <nightingale-interpro-track
              length={protein.length}
              display-start="1"
              display-end={protein.length}
              margin-color="transparent"
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

export default EntriesOnProtein;
