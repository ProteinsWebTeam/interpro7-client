// @flow
import React, {PureComponent} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {parse} from 'url';

import {goToLocation} from 'actions/creators';

const happenedWithModifierKey = event => !!(
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);
const happenedWithLeftClick = event => event.button === 0;

const defaultMatchFn = (toOfLink, {pathname}) => {
  let to = toOfLink;
  if (typeof toOfLink === 'string') to = parse(toOfLink);
  return pathname.startsWith((to.pathname || '').replace(/\/*$/, ''));
};

class Link extends PureComponent {
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
    activeClass: T.oneOfType([
      T.string,
      T.func,
    ]),
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
    let className = `${cn || ''} `;
    if (typeof activeClass === 'function') {
      className += activeClass(location, defaultMatchFn);
    } else if (defaultMatchFn(to, location)) {
      className += activeClass || '';
    }
    return (
      <a
        {...props}
        className={className.trim() || null}
        onClick={this.handleClick}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.location,
  location => ({location})
);

export default connect(mapStateToProps, {goToLocation})(Link);
