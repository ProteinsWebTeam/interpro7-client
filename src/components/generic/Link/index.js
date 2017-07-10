// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { stringify as qsStringify } from 'query-string';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import description2description from 'utils/processLocation/description2description';
import description2path from 'utils/processLocation/description2path';
import config from 'config';

import { goToNewLocation } from 'actions/creators';

const happenedWithModifierKey = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
const happenedWithLeftClick = event => event.button === 0;

const getNextLocation = (location, to) =>
  typeof to === 'function' ? to(location) : to;

const generateHref = (nextLocation /*: Object */, href /*: ?string */) => {
  if (href) return href;
  return `${config.root.website.pathname}${description2path(
    description2description(nextLocation.description),
  )}?${qsStringify(nextLocation.search)}`.replace(/\?(#|$)/, '');
};

const generateClassName = (
  className /*: ?string */,
  activeClass /*: ?(string | function) */,
  location /*: Object */,
  nextLocation /*: Object */,
  href /*: ?string */,
) => {
  if (href || !(activeClass && nextLocation)) return className;
  if (typeof activeClass === 'function') {
    return `${className || ''} ${activeClass(location) || ''}`;
  }
  for (const [key, value] of Object.entries(nextLocation.description)) {
    // If it is ever true, it means we don't have a match
    if (location.description[key] !== value) return className;
  }
  // If we arrive here, we have a match
  return `${className || ''} ${activeClass}`;
};

class Link extends PureComponent {
  static propTypes = {
    onClick: T.func,
    location: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
    href: T.string,
    goToNewLocation: T.func.isRequired,
    target: T.string,
    newTo: T.oneOfType([
      T.shape({
        description: T.object.isRequired,
        search: T.object,
        hash: T.string,
      }),
      T.func,
    ]),
    className: T.string,
    activeClass: T.oneOfType([T.string, T.func]),
  };

  handleClick = event => {
    const { onClick, target, goToNewLocation, newTo, location } = this.props;
    // pass it on to an externally defined handler
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    // conditions to ignore handling
    if (!happenedWithLeftClick(event)) return;
    if (happenedWithModifierKey(event)) return;
    if (target) return;
    // OK, now we can handle it
    event.preventDefault();
    goToNewLocation(getNextLocation(location, newTo));
  };

  // TODO: remove eslint ignore after complete refactoring
  render() {
    const {
      onClick,
      location,
      goToNewLocation,
      activeClass,
      className,
      newTo,
      href,
      ...props
    } = this.props;
    const nextLocation = getNextLocation(location, newTo);
    const _href = generateHref(nextLocation, href);
    const _className =
      generateClassName(className, activeClass, location, nextLocation, href) ||
      '';
    return (
      <a
        {...props}
        href={_href}
        className={_className.trim() || null}
        onClick={this.handleClick}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(Link);
