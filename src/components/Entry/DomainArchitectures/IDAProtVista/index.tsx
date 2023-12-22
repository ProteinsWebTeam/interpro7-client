import React from 'react';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';
import DynamicTooltip from 'components/SimpleCommonComponents/DynamicTooltip';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import NightingaleInterProTrack from 'components/Nightingale/InterProTrack';

import cssBinder from 'styles/cssBinder';
import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(protvista);

const MAX_PERC_WIDTH = 80; // Just to reseve a bit for the labels
const HEIGHT_OF_TRACKS = 22;

type Props = {
  matches: Array<{
    accession: string;
    locations: ProtVistaLocation[];
    name: string;
  }>;
  highlight?: Array<string>;
  databases: DBsInfo;
  length: number;
  maxLength: number;
};

const IDAProtVista = ({
  matches,
  length,
  maxLength,
  databases,
  highlight = [],
}: Props) => {
  const width = `${(MAX_PERC_WIDTH * length) / maxLength}%`;
  return (
    <div className={css('ida-protvista')}>
      {matches.map((d, i) => (
        <div key={`${d.accession}-${i}`} className={css('track-row')}>
          <div
            className={css('track-component', {
              highlight: highlight.indexOf(d.accession) >= 0,
            })}
            style={{
              width,
            }}
          >
            <DynamicTooltip
              type="entry"
              source={
                d.accession.toLowerCase().startsWith('ipr')
                  ? 'interpro'
                  : 'pfam'
              }
              accession={`${d.accession}`}
              databases={databases}
              locations={d.locations}
            >
              <NightingaleInterProTrack
                length={length}
                display-start={1}
                display-end={length}
                data={[d]}
                shape="roundRectangle"
                margin-color="#fafafa"
                expanded
                use-ctrl-to-zoom
                height={HEIGHT_OF_TRACKS}
                color={getTrackColor(
                  { accession: d.accession },
                  EntryColorMode.ACCESSION,
                )}
              />
            </DynamicTooltip>
          </div>
          <div className={css('track-accession')}>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: d.accession.toLowerCase().startsWith('ipr')
                      ? 'InterPro'
                      : 'pfam',
                    accession: d.accession,
                  },
                },
              }}
            >
              {d.name}
            </Link>
          </div>
        </div>
      ))}
      <div className={css('track-row')}>
        <div
          className={css('track-length')}
          style={{
            width,
          }}
        >
          <div className={css('note')} />
          <div className={css('length')}>
            <NumberComponent noTitle>{length}</NumberComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDAProtVista;
