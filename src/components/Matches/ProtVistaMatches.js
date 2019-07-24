// @flow
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

/*:: type Props = {
  matches: Array<Object>,
  data: Array<Object>,
  options: Object
};*/

class ProtVistaMatches extends PureComponent /*:: <Props> */ {
  /*::
    web_tracks: Object;
    updateTracksWithData: function;
  */
  static propTypes = {
    matches: T.array.isRequired,
    data: T.array,
    options: T.object,
  };

  constructor(props /*: Props */) {
    super(props);

    this.web_tracks = {};
  }

  async componentDidMount() {
    await loadProtVistaWebComponents();
    this.updateTracksWithData(this.props);
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (prevProps.data !== this.props.matches) {
      this.updateTracksWithData(this.props);
    }
  }
}

export default ProtVistaMatches;
