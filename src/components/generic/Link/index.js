import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {parse} from 'url';

import {goToLocation} from 'actions/creators';

const happenedWithModifierKey = event => !!(
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);
const happenedWithLeftClick = event => event.button === 0;

const match = (toOfLink, {pathname}) => {
  let to = toOfLink;
  if (typeof toOfLink === 'string') to = parse(toOfLink);
  return pathname.startsWith(to.pathname);
};

class Link extends Component {
  static propTypes = {
    onClick: T.func,
    location: T.shape({
      pathname: T.string.isRequired,
    }).isRequired,
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
    className: T.string,
    activeClass: T.string,
  };

  handleClick = event => {
    const {onClick, target, goToLocation, to} = this.props;
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
    const {
      onClick, location, goToLocation, activeClass, className: cn, to, ...props
    } = this.props;
    const className = `${
      match(to, location) ? activeClass : ''
    } ${cn || ''}`.trim();
    return (
      <a {...props} className={className || null} onClick={this.handleClick} />
    );
  }
}

export default connect(({location}) => ({location}), {goToLocation})(Link);
