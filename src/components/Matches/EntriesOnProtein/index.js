/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import loadable from 'higherOrder/loadable';

import ProtVistaMatches from '../ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entryColor';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@id': '@isContainedIn',
  '@type': ['Protein', 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
  identifier: data.protein.accession,
  name: data.protein.name,
  location: (
    data.protein.entry_protein_locations || data.entry.entry_protein_locations
  ).map(loc => ({
    '@type': 'PropertyValue',
    minValue: loc.fragments[0].start,
    maxValue: loc.fragments[0].end,
  })),
});

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

  updateTracksWithData(data) {
    const firstMatch = data[0];
    const protein = data[0].protein;
    let locations = [];
    if (firstMatch.entry && firstMatch.entry.entry_protein_locations)
      locations = firstMatch.entry.entry_protein_locations;
    else if (firstMatch.protein && firstMatch.protein.entry_protein_locations)
      locations = firstMatch.protein.entry_protein_locations;
    const d = data[0].entry;
    const tmp = locations.map(loc => ({
      accession: d.accession,
      name: d.name,
      source_database: d.source_database,
      locations: [loc],
      color: getTrackColor(d, EntryColorMode.ACCESSION),
      entry_type: d.entry_type,
      type: 'entry',
    }));

    this.web_tracks[d.accession].data = tmp;
    if (!this.web_protein.data)
      this.web_protein.data = protein.sequence || ' '.repeat(protein.length);
  }

  render() {
    const { matches } = this.props;
    const protein = matches[0].protein;
    const entry = matches[0].entry;
    return (
      <div className={f('track-in-table')}>
        <SchemaOrgData data={matches[0]} processData={schemaProcessData} />
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

export default EntriesOnProtein;
