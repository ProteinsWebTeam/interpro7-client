// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import cn from 'classnames';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';

import { goToCustomLocation, closeEverything } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import generateHref from './utils/generate-href';
import generateRel from './utils/generate-rel';
import generateClassName from './utils/generate-classname';

import { DEV } from 'config';

const happenedWithModifierKey = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
const happenedWithLeftClick = event => event.button === 0;

const getNextLocation = (customLocation, to) =>
  typeof to === 'function' ? to(customLocation) : to;

/*:: type Props = {
  onClick?: function,
  customLocation: {
    description: Object,
    search: Object,
    hash: string,
  },
  exact?: boolean,
  children: any,
  rel?: string,
  href?: string,
  closeEverything: function,
  goToCustomLocation: function,
  target?: string,
  to?: function | {
    description: Object,
    search?: Object,
    hash?: string,
  },
  style?: ?Object,
  disabled?: boolean,
  className?: string,
  activeClass?: function | string,
  withReferrer?: boolean,
}; */

class Link extends PureComponent /*:: <Props> */ {
  static propTypes = {
    onClick: T.func,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
    exact: T.bool,
    children: T.any,
    rel: T.string,
    href: T.string,
    closeEverything: T.func.isRequired,
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
    withReferrer: T.bool,
  };

  handleClick = event => {
    const {
      disabled,
      onClick,
      target,
      closeEverything,
      goToCustomLocation,
      to,
      href,
      customLocation,
    } = this.props;
    // pass it on to an externally defined handler
    if (disabled) {
      event.preventDefault();
      return;
    }

    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    closeEverything();
    if (!to && href) return;
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
      // unused (to prevent passing down)
      onClick,
      closeEverything,
      goToCustomLocation,
      // used or changed
      exact,
      customLocation,
      activeClass,
      className,
      to,
      disabled,
      href,
      children,
      rel,
      target,
      withReferrer,
      // passed down
      ...props
    } = this.props;
    let _disabled = disabled;
    let _children = children;
    let _href;
    let activeClassName;
    try {
      const nextCustomLocation = getNextLocation(customLocation, to) || {};
      nextCustomLocation.description = descriptionToDescription(
        nextCustomLocation.description,
      );
      _href = generateHref(nextCustomLocation, href);
      activeClassName = generateClassName(
        activeClass,
        customLocation,
        href,
        _href,
        exact,
      );
    } catch (error) {
      console.error(error);
      _disabled = true;
      if (DEV) {
        props.style = {
          ...(props.style || {}),
          border: '5px dashed red',
          color: 'darkred',
        };
        _children = (
          <>
            ⚠️
            {children}
            ⚠️
          </>
        );
      }
    }
    if (_disabled) {
      props.style = {
        ...(props.style || {}),
        // userSelect: 'none',
        pointerEvents: 'none',
        cursor: 'not-allowed',
        opacity: 0.3,
      };
    }
    const _rel = generateRel(rel, target, href, withReferrer);
    return (
      <a
        {...props}
        href={_href}
        rel={_rel}
        target={target}
        className={cn(className, activeClassName) || null}
        onClick={this.handleClick}
      >
        {_children}
      </a>
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  {
    closeEverything,
    goToCustomLocation,
  },
)(Link);
