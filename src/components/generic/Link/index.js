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
    description2description(nextLocation.description)
  )}?${qsStringify(nextLocation.search)}`.replace(/\?(#|$)/, '');
};

const generateClassName = (
  className /*: ?string */,
  activeClass /*: ?(string | function) */,
  location /*: Object */,
  nextLocation /*: Object */,
  href /*: ?string */
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

/*:: type Props = {
  onClick: ?function,
  location: {
    description: Object,
    search: Object,
    hash: string,
  },
  children: any,
  href: ?string,
  goToNewLocation: function,
  target: ?string,
  newTo: ?function | {
    description: Object,
    search: ?Object,
    hash: ?string,
  },
  style?: ?Object,
  disabled: ?boolean,
  className: ?string,
  activeClass: ?function | string,
}; */

class Link extends PureComponent /*:: <Props> */ {
  static propTypes = {
    onClick: T.func,
    location: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
    children: T.any,
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
    disabled: T.bool,
    className: T.string,
    activeClass: T.oneOfType([T.string, T.func]),
  };

  handleClick = event => {
    const {
      onClick,
      target,
      goToNewLocation,
      newTo,
      href,
      location,
    } = this.props;
    // pass it on to an externally defined handler
    if (onClick) onClick(event);
    if (!newTo && href) return;
    if (event.defaultPrevented) return;
    // conditions to ignore handling
    if (!happenedWithLeftClick(event)) return;
    if (happenedWithModifierKey(event)) return;
    if (target) return;
    // OK, now we can handle it
    event.preventDefault();
    if (this.props.disabled) return;
    goToNewLocation(getNextLocation(location, newTo));
  };

  render() {
    const {
      onClick,
      location,
      goToNewLocation,
      activeClass,
      className,
      newTo,
      disabled,
      href,
      children,
      ...props
    } = this.props;
    const nextLocation = getNextLocation(location, newTo) || {};
    const _href = generateHref(nextLocation, href);
    const _className =
      generateClassName(className, activeClass, location, nextLocation, href) ||
      '';
    if (disabled) {
      props.style = {
        ...(props.style || {}),
        userSelect: 'none',
        pointerEvents: 'none',
        cursor: 'not-allowed',
        opacity: 0.5,
      };
    }
    return (
      <a
        {...props}
        href={_href}
        className={_className.trim() || null}
        onClick={this.handleClick}
      >
        {children}
      </a>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location })
);

export default connect(mapStateToProps, { goToNewLocation })(Link);
