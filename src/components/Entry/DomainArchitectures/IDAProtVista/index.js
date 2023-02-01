import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import ProtVistaMatches from 'components/Matches/ProtVistaMatches';
import NumberComponent from 'components/NumberComponent';
import DynamicTooltip from 'components/SimpleCommonComponents/DynamicTooltip';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import { foundationPartial } from 'styles/foundation';
import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

const MAX_PERC_WIDTH = 80; // Just to reseve a bit for the labels

/* :: type Props = {
  matches: Array<Object>,
  highlight: Array<string>,
  databases: Object,
  attributeForLabel: 'name'|'accession',
  length: number,
  maxLength: number,
}
*/
class IDAProtVista extends ProtVistaMatches /*:: <Props> */ {
  static propTypes = {
    matches: T.arrayOf(T.object).isRequired,
    databases: T.object.isRequired,
    highlight: T.arrayOf(T.string),
    attributeForLabel: T.string,
    length: T.number,
    maxLength: T.number,
  };

  updateTracksWithData(props /*: Props */) {
    const { matches } = props;

    matches.forEach((domain, i) => {
      const isIPR = domain.accession.toLowerCase().startsWith('ipr');
      const sourceDatabase = isIPR ? 'interpro' : 'pfam';
      const tmp = [
        {
          name: domain.accession,
          source_database: sourceDatabase,
          color: getTrackColor(
            { accession: domain.accession },
            EntryColorMode.ACCESSION,
          ),
          type: 'entry',
          ...domain,
        },
      ];
      this.web_tracks[`track_${domain.accession}_${i}`].data = tmp;
    });
  }

  render() {
    const {
      matches,
      length,
      maxLength,
      databases,
      highlight = [],
      attributeForLabel,
    } = this.props;

    const width = `${(MAX_PERC_WIDTH * length) / maxLength}%`;
    return (
      <div className={f('ida-protvista')}>
        {matches.map((d, i) => (
          <div key={`${d.accession}-${i}`} className={f('track-row')}>
            <div
              className={f('track-component', {
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
                <protvista-interpro-track
                  length={length}
                  displaystart="1"
                  displayend={length}
                  id={`track_${d.accession}_${i}`}
                  ref={(e) =>
                    (this.web_tracks[`track_${d.accession}_${i}`] = e)
                  }
                  shape="roundRectangle"
                  expanded
                  use-ctrl-to-zoom
                />
              </DynamicTooltip>
            </div>
            <div className={f('track-accession')}>
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
                {d[attributeForLabel]}
              </Link>
            </div>
          </div>
        ))}
        <div className={f('track-row')}>
          <div
            className={f('track-length')}
            style={{
              width,
            }}
          >
            <div className={f('note')} />
            <div className={f('length')}>
              <NumberComponent noTitle>{length}</NumberComponent>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IDAProtVista;
