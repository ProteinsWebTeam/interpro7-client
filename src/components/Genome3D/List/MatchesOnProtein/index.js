import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import ProtVistaMatches from 'components/Matches/ProtVistaMatches';

import protvista from 'components/ProtVista/style.css';

const f = foundationPartial(protvista);

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

//TODO: get the length from genome3d?
const protein = { length: 1000 };

class MatchesOnProtein extends ProtVistaMatches {
  updateTracksWithData({ matches, accession }) {
    this.web_tracks[accession].data = [
      {
        locations: matches,
        color: getTrackColor({ accession }, EntryColorMode.ACCESSION),
      },
    ];

    if (!this.web_protein.data)
      this.web_protein.data =
        protein.sequence || '\u00A0'.repeat(protein.length);
  }
  render() {
    const { tooltip, accession } = this.props;
    return (
      <div className={f('track-in-table')}>
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
          <Tooltip title={tooltip}>
            <protvista-interpro-track
              length={protein.length}
              displaystart="1"
              displayend={protein.length}
              id={`track_${accession}`}
              ref={e => (this.web_tracks[accession] = e)}
              shape="roundRectangle"
              expanded
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default MatchesOnProtein;
