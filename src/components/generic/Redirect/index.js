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

const Redirect = class extends PureComponent /*:: <Props> */ {
  static propTypes = {
    goToNewLocation: T.func.isRequired,
    to: T.shape({
      description: T.object.isRequired,
      search: T.object,
      hash: T.string,
    }).isRequired,
  };

  componentWillMount() {
    this.props.goToNewLocation(this.props.to);
  }

  render() {
    return null;
  }
};

export default connect(null, { goToNewLocation })(Redirect);
