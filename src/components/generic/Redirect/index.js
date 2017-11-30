// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToNewLocation, goToCustomLocation } from 'actions/creators';

/*:: type OldProps = {
  goToNewLocation: function,
  to: {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
}; */

class _OldRedirect extends PureComponent /*:: <OldProps> */ {
  static propTypes = {
    goToNewLocation: T.func.isRequired,
    to: T.shape({
      description: T.object.isRequired,
      search: T.object,
      hash: T.string,
    }).isRequired,
  };

  componentWillMount() {
    // Go to the new location, but replacing current location
    this.props.goToNewLocation(this.props.to, true);
  }

  render() {
    return null;
  }
}

export const OldRedirect = connect(null, { goToNewLocation })(_OldRedirect);

/*:: type Props = {
  goToCustomLocation: function,
  to: {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
}; */

class Redirect extends PureComponent /*:: <Props> */ {
  static propTypes = {
    goToCustomLocation: T.func.isRequired,
    to: T.shape({
      description: T.object.isRequired,
      search: T.object,
      hash: T.string,
    }).isRequired,
  };

  componentWillMount() {
    // Go to the new location, but replacing current location
    this.props.goToCustomLocation(this.props.to, true);
  }

  render() {
    return null;
  }
}

export default connect(null, { goToCustomLocation })(Redirect);
