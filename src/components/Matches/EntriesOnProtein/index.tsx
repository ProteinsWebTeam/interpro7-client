import React, { useEffect, useState } from 'react';

import { location2html } from 'utils/text';
import { EntryColorMode, getTrackColor } from 'utils/entry-color';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';
import { GenericMatch, Feature } from '../MatchesByPrimary';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

type Props = { matches: Array<GenericMatch> }

const EntriesOnProtein = ({ matches }: Props) => {
  const [data, setData] = useState<Array<Feature> | null>(null);
  const firstMatch = matches?.[0];
  const { entry, protein } = firstMatch || {};

  useEffect(() => {
    if (!matches.length || !entry || !protein) return;

    let locations: Array<ProtVistaLocation> = [];
    if (entry?.entry_protein_locations)
      locations = entry?.entry_protein_locations;
    else if (protein && protein.entry_protein_locations)
      locations = protein.entry_protein_locations;
    setData(locations.map((loc) => ({
      accession: entry.accession,
      name: entry.name,
      source_database: entry.source_database,
      locations: [loc],
      color: getTrackColor(entry, EntryColorMode.ACCESSION),
      entry_type: entry.entry_type,
      type: 'entry',
    }))
    );
  }, [entry, protein]);


  if (matches.length > 1) {
    console.error(
      'There are several matches and this component is using only one',
    );
    console.table(matches);
  }
  if (!matches.length || !entry || !protein) return null;



  return (
    <div className={css('track-in-table')}>
      {/* <SchemaOrgData data={matches[0]} processData={schemaProcessData} />*/}
      <div className={css('track-container')}>
        <div className={css('aligned-to-track-component')}>
          <NightingaleSequence
            sequence={protein.sequence || '\u00A0'.repeat(protein.length)}
            length={protein.length}
            display-start={1}
            display-end={protein.length}
            height={30}
            use-ctrl-to-zoom
          />
        </div>
      </div>
      <div className={css('track-component')}>
        <Tooltip
          title={location2html(
            entry.entry_protein_locations || protein.entry_protein_locations || [],
            entry.accession,
            (entry?.name as NameObject)?.name || (entry?.name as NameObject)?.short || entry.name,
          )}
        >
          <NightingaleInterProTrack
            length={protein.length}
            display-start={1}
            display-end={protein.length}
            margin-color="#fafafa"
            id={`track_${entry.accession}`}
            data={data || []}
            shape="roundRectangle"
            expanded
            use-ctrl-to-zoom
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default EntriesOnProtein;
