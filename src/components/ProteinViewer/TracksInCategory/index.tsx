import React from 'react';
import cssBinder from 'styles/cssBinder';

import NightingaleInterProTrack from 'components/Nightingale/Navigation';
import NightingaleColoredSequence from 'components/Nightingale/ColoredSequence';
// import NightingaleSequence from 'components/Nightingale/Sequence';

import { Feature } from '@nightingale-elements/nightingale-track';
import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';

const css = cssBinder(style, grid);

type Props = {
  entries: Array<Feature & { data?: unknown }>;
  highlightColor: string;
  hideCategory: boolean;
  sequence: string;
};

const OTHER_TRACK_TYPES = [
  'secondary_structure',
  'sequence_conservation',
  'confidence',
  'residue',
];
const TracksInCategory = ({
  entries,
  sequence,
  hideCategory,
  highlightColor,
}: Props) => {
  return (
    <>
      {entries &&
        entries.map((entry) => {
          const type = entry.type || '';

          return (
            <React.Fragment key={entry.accession}>
              <div
                className={css('track', {
                  hideCategory,
                })}
              >
                {OTHER_TRACK_TYPES.includes(type) ? (
                  <div className={css('track', type.replace('_', '-'))}>
                    {entry.type === 'confidence' && (
                      <NightingaleColoredSequence
                        // ref={(e) =>
                        //   (this.web_tracks[entry.accession] = e)
                        // }
                        id={`track_${entry.accession}`}
                        data={entry.data as string}
                        length={sequence.length}
                        display-start={1}
                        display-end={length}
                        scale="H:90,M:70,L:50,D:0"
                        height={12}
                        color-range="#ff7d45:0,#ffdb13:50,#65cbf3:70,#0053d6:90,#0053d6:100"
                        margin-left={10}
                        margin-right={10}
                        margin-color="#fafafa"
                        highlight-event="onmouseover"
                        highlight-color={highlightColor}
                        className="confidence"
                        use-ctrl-to-zoom
                      />
                    )}
                  </div>
                ) : (
                  <b>
                    Interprotrack {entry.accession}
                    <br />
                  </b>
                  //   <NightingaleInterProTrack
                  //   length={length}
                  //   displaystart="1"
                  //   displayend={length}
                  //   margin-color="#fafafa"
                  //   id={`track_${entry.accession}`}
                  //   ref={(e) =>
                  //     (this.web_tracks[getUIDFromEntry(entry)] =
                  //       e)
                  //   }
                  //   shape="roundRectangle"
                  //   highlight-event="onmouseover"
                  //   highlight-color={highlightColor}
                  //   show-label
                  //   label=".feature.short_name"
                  //   use-ctrl-to-zoom
                  //   expanded
                  // />
                )}
              </div>
            </React.Fragment>
          );
        })}
    </>
  );
};

export default TracksInCategory;
