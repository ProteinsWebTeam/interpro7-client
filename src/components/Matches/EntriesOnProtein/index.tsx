import React, { useEffect, useState } from 'react';

import { EntryColorMode, getTrackColor } from 'utils/entry-color';

import TooltipForTrack from 'components/SimpleCommonComponents/Tooltip/ForTrack';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';
import NightingaleSequence from 'components/Nightingale/Sequence';
import { GenericMatch, Feature } from '../MatchesByPrimary';

import cssBinder from 'styles/cssBinder';

import protvista from 'components/ProteinViewer/style.css';
import EntryPopup from 'components/SimpleCommonComponents/Tooltip/EntryPopup';

const css = cssBinder(protvista);

type Props = { match: GenericMatch; matches: Array<AnyMatch> };

const EntriesOnProtein = ({ matches, match }: Props) => {
  const [data, setData] = useState<Array<Feature> | null>(null);
  const [locationHovered, setLocationHovered] = useState<
    Array<ProtVistaLocation>
  >([]);
  const { entry, protein } = match || {};

  useEffect(() => {
    if (matches === undefined || !matches.length || !entry || !protein) return;

    setData(
      matches.map((loc) => ({
        accession: entry.accession,
        name: entry.name,
        source_database: entry.source_database,
        locations: loc.entry_protein_locations || [],
        color: getTrackColor(entry, EntryColorMode.ACCESSION),
        entry_type: entry.entry_type,
        type: 'entry',
      }))
    );
  }, [entry, protein]);

  if (matches === undefined || !matches.length || !entry || !protein)
    return null;

  return (
    <div className={css('track-in-table')}>
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
        <TooltipForTrack
          message={
            <EntryPopup
              locations={locationHovered}
              accession={entry.accession}
              dbName={entry.source_database}
              name={
                (entry?.name as NameObject)?.short ||
                (entry.name as string) ||
                ''
              }
            />
          }
          onMouseOverFeature={(locations: Array<ProtVistaLocation>) => {
            setLocationHovered(locations);
          }}
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
        </TooltipForTrack>
      </div>
    </div>
  );
};

export default EntriesOnProtein;
