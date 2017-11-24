// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToNewLocation } from 'actions/creators';

/*:: type Props = {
  goToNewLocation: function,
  to: {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
}; */

class _OldRedirect extends PureComponent /*:: <Props> */ {
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

// export default connect(null, { goToNewLocation })(Redirect);
