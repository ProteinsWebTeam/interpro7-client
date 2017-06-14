// @flow
import React, {PureComponent} from 'react';
import T from 'prop-types';
import {stringify as qsStringify} from 'query-string';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import description2description from
  'utils/processLocation/description2description';
import description2path from 'utils/processLocation/description2path';
import config from 'config';

import {goToLocation, goToNewLocation} from 'actions/creators';

const happenedWithModifierKey = event => !!(
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
);
const happenedWithLeftClick = event => event.button === 0;

const defaultMatchFn = () => true;// {
//   return true;
//   let to = toOfLink;
//   if (typeof toOfLink === 'string') to = parse(toOfLink);
//   return pathname.startsWith((to.pathname || '').replace(/\/*$/, ''));
// };

const generateHref = (location/*: Object */, to/*: string | Object */) => {
  if (typeof to === 'string') {
    return '';
    // return config.root.website.pathname + resolve(location.pathname, to);
  }
  return '';
  // return format({
  //   ...config.root.website,
  //   pathname: config.root.website.pathname + resolve(
  //     location.pathname,
  //     to.pathname || ''
  //   ),
  //   query: to.search || {},
  //   hash: to.hash || '',
  // });
};

class Link extends PureComponent {
  static propTypes = {
    onClick: T.func,
    location: T.shape({
      pathname: T.string.isRequired,
    }).isRequired,
    newLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
      hash: T.string.isRequired,
    }).isRequired,
    href: T.string,
    goToLocation: T.func.isRequired,
    goToNewLocation: T.func.isRequired,
    target: T.string,
    to: T.oneOfType([
      T.string,
      T.shape({
        description: T.object.isRequired,
        search: T.object,
        hash: T.string,
      }),
    ]),
    newTo: T.oneOfType([
      T.shape({
        description: T.object.isRequired,
        search: T.object,
        hash: T.string,
      }),
      T.func,
    ]),
    className: T.string,
    activeClass: T.oneOfType([
      T.string,
      T.func,
    ]),
  };

  handleClick = event => {
    const {
      onClick, target, goToLocation, goToNewLocation, to, newTo, newLocation,
    } = this.props;
    // pass it on to an externally defined handler
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    // conditions to ignore handling
    if (!happenedWithLeftClick(event)) return;
    if (happenedWithModifierKey(event)) return;
    if (target) return;
    // OK, now we can handle it
    event.preventDefault();
    if (newTo) {
      goToNewLocation(typeof newTo === 'function' ? newTo(newLocation) : newTo);
    } else {
      goToLocation(to);
    }
  };

  // TODO: remove eslint ignore after complete refactoring
  // eslint-disable-next-line complexity
  render() {
    const {
      onClick, location, newLocation, goToLocation, goToNewLocation,
      activeClass, className: cn, to, newTo, href,
      ...props
    } = this.props;
    let className = `${cn || ''} `;
    if (!href && !newTo) {
      if (typeof activeClass === 'function') {
        className += activeClass(location, defaultMatchFn);
      } else {
        className += activeClass || '';
      }
    }
    let _href = href;
    if (!_href && newTo) {
      let _newTo = newTo;
      if (typeof newTo === 'function') _newTo = newTo(newLocation);
      _href = `${config.root.website.pathname}${
        description2path(description2description(_newTo.description))
      }?${qsStringify(_newTo.search)}`.replace(/\?$/, '');
    }
    return (
      <a
        {...props}
        href={_href || generateHref(location, to) || ''}
        className={className.trim() || null}
        onClick={this.handleClick}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.location,
  state => state.newLocation,
  (location, newLocation) => ({location, newLocation}),
);

export default connect(mapStateToProps, {goToLocation, goToNewLocation})(Link);
