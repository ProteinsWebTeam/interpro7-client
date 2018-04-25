import { PureComponent } from 'react';
import T from 'prop-types';

import loadWebComponent from 'utils/load-web-component';

import ProtVistaInterProTrack from 'protvista-interpro-track';
import ProtVistaManager from 'protvista-manager';
import ProtVistaSequence from 'protvista-sequence';

const webComponents = [];

const loadProtVistaWebComponents = () => {
  if (!webComponents.length) {
    webComponents.push(
      loadWebComponent(() => ProtVistaManager).as('protvista-manager'),
    );
    webComponents.push(
      loadWebComponent(() => ProtVistaSequence).as('protvista-sequence'),
    );
    webComponents.push(
      loadWebComponent(() => ProtVistaInterProTrack).as(
        'protvista-interpro-track',
      ),
    );
  }
  return Promise.all(webComponents);
};

class ProtVistaMatches extends PureComponent {
  static propTypes = {
    matches: T.array.isRequired,
    options: T.object,
  };

  constructor(props) {
    super(props);

    this.web_tracks = {};
  }

  async componentDidMount() {
    await loadProtVistaWebComponents();
    this.updateTracksWithData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.matches) {
      this.updateTracksWithData(this.props);
    }
  }
}

export default ProtVistaMatches;
