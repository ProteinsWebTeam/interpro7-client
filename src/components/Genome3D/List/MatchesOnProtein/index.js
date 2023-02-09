import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import ProtVistaMatches from 'components/Matches/ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

/* :: type Props = {
  matches: Array<Object>,
  accession: string,
  tooltip: string,
  length: number
}; */

class MatchesOnProtein extends ProtVistaMatches {
  static propTypes = {
    matches: T.array.isRequired,
    accession: T.string,
    tooltip: T.string,
    length: T.number,
  };

  updateTracksWithData({ matches, accession, length }) {
    this.web_tracks[accession].data = [
      {
        accession,
        locations: matches,
        color: getTrackColor({ accession }, EntryColorMode.ACCESSION),
      },
    ];

    if (!this.web_protein.data) this.web_protein.data = '\u00A0'.repeat(length);
  }
  render() {
    const { tooltip, accession, length } = this.props;
    return (
      <div className={f('track-in-table')}>
        <div className={f('track-container')}>
          <div className={f('aligned-to-track-component')}>
            <nightingale-sequence
              ref={(e) => (this.web_protein = e)}
              length={length}
              display-start="1"
              display-end={length}
              height="30"
              use-ctrl-to-zoom
            />
          </div>
        </div>
        <div className={f('track-component')}>
          <Tooltip title={tooltip}>
            <nightingale-interpro-track
              length={length}
              display-start="1"
              display-end={length}
              margin-color="transparent"
              id={`track_${accession}`}
              ref={(e) => (this.web_tracks[accession] = e)}
              expanded
              use-ctrl-to-zoom
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default MatchesOnProtein;
