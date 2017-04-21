import {Component} from 'react'; import T from 'prop-types';
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

export default connect(null, {goToLocation})(Redirect);
