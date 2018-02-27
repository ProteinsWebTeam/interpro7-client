import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadWebComponent from 'utils/loadWebComponent';

import ProtVistaInterProTrack from 'protvista-interpro-track';
import ProtVistaManager from 'protvista-manager';
import ProtVistaSequence from 'protvista-sequence';

const webComponents = [];

class ProtVistaMatches extends PureComponent {
  static propTypes = {
    matches: T.array.isRequired,
    options: T.object,
  };
  constructor(props) {
    super(props);
    this.web_tracks = {};
  }
  componentWillMount() {
    if (webComponents.length) return;
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
  async componentDidMount() {
    await Promise.all(webComponents);
    const { matches } = this.props;
    // if (matches.length > 1) {
    //   console.error(
    //     'There are several matches and this component is using only one',
    //   );
    //   console.table(matches);
    // }
    this.updateTracksWithData(this.props);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.matches) {
      this.updateTracksWithData(this.props);
    }
  }
}
export default ProtVistaMatches;
