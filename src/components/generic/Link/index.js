// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { stringify as qsStringify } from 'query-string';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import config from 'config';

import { goToCustomLocation } from 'actions/creators';

const happenedWithModifierKey = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
const happenedWithLeftClick = event => event.button === 0;

const getNextLocation = (customLocation, to) =>
  typeof to === 'function' ? to(customLocation) : to;

const rootPathname = config.root.website.pathname.replace(/\/$/, '');

const generateHref = (nextLocation /*: Object */, href /*?: string */) => {
  if (href) return href;
  return `${rootPathname}${descriptionToPath(
    nextLocation.description,
  )}?${qsStringify(nextLocation.search)}`.replace(/\?(#|$)/, '');
};

const generateClassName = (
  className /*: ?string */,
  activeClass /*: ?(string | function) */,
  customLocation /*: Object */,
  nextCustomLocation /*: Object */,
  href /*: ?string */,
) => {
  if (href || !(activeClass && nextCustomLocation)) return className;
  if (typeof activeClass === 'function') {
    return `${className || ''} ${activeClass(customLocation) || ''}`;
  }
  for (const [keyLevel1, intermediateValue] of Object.entries(
    nextCustomLocation.description,
  )) {
    for (const [keyLevel2, value] of Object.entries(intermediateValue || {})) {
      // If it is ever true, it means we don't have a match
      if (customLocation.description[keyLevel1][keyLevel2] !== value)
        return className;
    }
  }
  // If we arrive here, we have a match
  return `${className || ''} ${activeClass}`;
};

/*:: type Props = {
  onClick: ?function,
  customLocation: {
    description: Object,
    search: Object,
    hash: string,
  },
  children: any,
  href: ?string,
  goToCustomLocation: function,
  target: ?string,
  to: ?function | {
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
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
    children: T.any,
    href: T.string,
    goToCustomLocation: T.func.isRequired,
    target: T.string,
    to: T.oneOfType([
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
      goToCustomLocation,
      to,
      href,
      customLocation,
    } = this.props;
    // pass it on to an externally defined handler
    if (onClick) onClick(event);
    if (!to && href) return;
    if (event.defaultPrevented) return;
    // conditions to ignore handling
    if (!happenedWithLeftClick(event)) return;
    if (happenedWithModifierKey(event)) return;
    if (target) return;
    // OK, now we can handle it
    event.preventDefault();
    if (this.props.disabled) return;
    goToCustomLocation(getNextLocation(customLocation, to));
  };

  render() {
    const {
      onClick,
      customLocation,
      goToCustomLocation,
      activeClass,
      className,
      to,
      disabled,
      href,
      children,
      ...props
    } = this.props;
    const nextCustomLocation = getNextLocation(customLocation, to) || {};
    nextCustomLocation.description = descriptionToDescription(
      nextCustomLocation.description,
    );
    const _href = generateHref(nextCustomLocation, href);
    const _className =
      generateClassName(
        className,
        activeClass,
        customLocation,
        nextCustomLocation,
        href,
      ) || '';
    if (disabled) {
      props.style = {
        ...(props.style || {}),
        userSelect: 'none',
        // pointerEvents: 'none',
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(Link);
