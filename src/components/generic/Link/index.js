import React, {Component, PropTypes as T} from 'react';
import {connect} from 'react-redux';

import {goToLocation} from '../../../actions/creators';

const happenedWithModifierKey = event => !!(
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);
const happenedWithLeftClick = event => event.button === 0;

class Link extends Component {
  static propTypes = {
    onClick: T.func,
    goToLocation: T.func.isRequired,
    target: T.string,
    to: T.oneOfType([
      T.string,
      T.shape({
        pathname: T.string.isRequired,
        search: T.object,
        hash: T.string,
      }),
    ]),
  };

  handleClick = event => {
    const {onClick, target, goToLocation, to} = this.props;
    console.log(event);
    // pass it on to an externally defined handler
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    // conditions to ignore handling
    if (!happenedWithLeftClick(event)) return;
    if (happenedWithModifierKey(event)) return;
    if (target) return;
    // OK, now we can handle it
    event.preventDefault();
    goToLocation(to);
  };

  render() {
    const {onClick: _, goToLocation: __, ...props} = this.props;
    return <a {...props} onClick={this.handleClick} />;
  }
}

export default connect(null, {goToLocation})(Link);
