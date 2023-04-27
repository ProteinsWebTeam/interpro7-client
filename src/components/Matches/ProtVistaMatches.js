// @flow
import { PureComponent } from 'react';
import T from 'prop-types';

import '@nightingale-elements/nightingale-manager';
import '@nightingale-elements/nightingale-sequence';
import '@nightingale-elements/nightingale-interpro-track';

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
    const promises = [
      'nightingale-manager',
      'nightingale-sequence',
      'nightingale-interpro-track',
    ].map((localName) => customElements.whenDefined(localName));
    await Promise.all(promises);
    this.updateTracksWithData(this.props);
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (prevProps.data !== this.props.matches) {
      this.updateTracksWithData(this.props);
    }
  }
}

export default ProtVistaMatches;
