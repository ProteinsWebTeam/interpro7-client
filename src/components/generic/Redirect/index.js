// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

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

  componentDidMount() {
    // Go to the new location, but replacing current location
    this.props.goToCustomLocation(this.props.to, true);
  }

  render() {
    return null;
  }
}

export default connect(null, { goToCustomLocation })(Redirect);
