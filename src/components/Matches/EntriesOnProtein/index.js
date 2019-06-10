/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';
import { location2html } from 'utils/text';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

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
    const tmp = locations.map(loc => ({
      accession: entry.accession,
      name: entry.name,
      source_database: entry.source_database,
      locations: [loc],
      color: getTrackColor(entry, EntryColorMode.ACCESSION),
      entry_type: entry.entry_type,
      type: 'entry',
    }));

    this.web_tracks[entry.accession].data = tmp;

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
            <protvista-sequence
              ref={e => (this.web_protein = e)}
              length={protein.length}
              displaystart="1"
              displayend={protein.length}
            />
          </div>
        </div>
        <div className={f('track-component')}>
          <Tooltip
            title={location2html(
              entry.entry_protein_locations || protein.entry_protein_locations,
              entry.accession,
              entry.name.name ? entry.name.name : entry.name,
            )}
          >
            <protvista-interpro-track
              length={protein.length}
              displaystart="1"
              displayend={protein.length}
              id={`track_${entry.accession}`}
              ref={e => (this.web_tracks[entry.accession] = e)}
              shape="roundRectangle"
              expanded
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default EntriesOnProtein;
