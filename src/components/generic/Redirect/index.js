import {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {goToLocation} from 'actions/creators';

const Redirect = class extends Component {
  static propTypes = {
    goToLocation: T.func.isRequired,
    to: T.any.isRequired,
  };

  componentWillMount() {
    this.props.goToLocation(this.props.to);
  }

  render() {
    return null;
  }
};

// eslint-disable-next-line no-undefined
export default connect(undefined, {goToLocation})(Redirect);
