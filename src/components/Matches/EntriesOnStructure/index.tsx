import React, { useEffect, useState } from 'react';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { location2html } from 'utils/text';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';
import { GenericMatch, Feature } from '../MatchesByPrimary';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

type Props = { matches: Array<GenericMatch> }


const EntriesOnStructure = ({ matches }: Props) => {
  const [data, setData] = useState<Array<Feature> | null>(null);
  const firstMatch = matches?.[0];
  const { entry, structure } = firstMatch || {};

  useEffect(() => {
    if (!matches.length || !entry || !structure) return;

    let locations: Array<ProtVistaLocation> = [];
    if (entry && entry.entry_structure_locations)
      locations = entry.entry_structure_locations;
    else if (structure.entry_structure_locations)
      locations = structure.entry_structure_locations;


    setData(locations.map((loc) => ({
      accession: entry.accession,
      name: entry.name,
      // short_name: entry.short_name,
      source_database: entry.source_database,
      locations: [loc],
      color: getTrackColor(entry, EntryColorMode.ACCESSION),
      entry_type: entry.entry_type,
      type: 'entry',
    }))
    );

  }, [entry, structure]);


  // updateTracksWithData({ matches: data }) {

  // }

  if (matches.length > 1) {
    console.error(
      'There are several matches and this component is using only one',
    );
    console.table(matches);
  }

  if (!matches.length || !entry || !structure) return null;

  const length = structure.sequence_length || entry.sequence_length;
  const sequence = structure.sequence || entry.sequence || '\u00A0'.repeat(length);

  return (
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
            structure.entry_structure_locations ||
            entry.entry_structure_locations || [],
            structure.accession,
            (structure?.name as NameObject)?.name ? (structure?.name as NameObject).name : structure.name,
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
  );
}

export default EntriesOnStructure;
