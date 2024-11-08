// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import { goToCustomLocation } from 'actions/creators';
// $FlowFixMe
import { customLocationSelector } from 'reducers/custom-location';

/*:: type Props = {
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
  to: function | string | {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
}; */

class Redirect extends PureComponent /*:: <Props> */ {
  static propTypes = {
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object,
      hash: T.string,
    }).isRequired,
    to: T.oneOfType([
      T.shape({
        description: T.object.isRequired,
        search: T.object,
        hash: T.string,
      }),
      T.func,
      T.string,
    ]),
  };

  componentDidMount() {
    const { to, customLocation, goToCustomLocation } = this.props;
    console.log(to, customLocation, goToCustomLocation);
    // Go to the new location, but replacing current location
    let _to = to;
    if (typeof to === 'function') {
      _to = to(customLocation);
    }

    // Check if _to is an external URL
    if (typeof _to === 'string' && /^https?:\/\//.test(_to)) {
      // External redirection
      window.location.replace(_to);
    } else {
      // Internal redirection
      goToCustomLocation(_to, true);
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(Redirect);
