// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NotFound from 'pages/error/NotFound';

import { customLocationSelector } from 'reducers/custom-location';
/*:: import type { CustomLocation } from 'reducers/custom-location'; */

const match = (childRoutes, indexRoute, valueFromLocation) => {
  if (!valueFromLocation) return { Component: indexRoute, matched: null };
  for (const [value, component] of childRoutes.entries()) {
    if (typeof value === 'string') {
      if (value === valueFromLocation) {
        return { Component: component, matched: valueFromLocation };
      }
    } else {
      if (value.test(valueFromLocation)) {
        return { Component: component, matched: valueFromLocation };
      }
    }
  }
};

/*:: type Props = {
  indexRoute: function,
  locationSelector: function,
  childRoutes: ?Map<string | RegExp, Class<React$Component<*, *>>>,
  catchAll?: function,
  customLocation: CustomLocation,
}; */

class _Switch extends PureComponent /*:: <Props> */ {
  static propTypes = {
    indexRoute: T.func.isRequired,
    locationSelector: T.func.isRequired,
    childRoutes: T.instanceOf(Map),
    catchAll: T.func,
    customLocation: T.object.isRequired,
  };

  render() {
    const {
      indexRoute,
      locationSelector,
      childRoutes,
      catchAll = NotFound,
      customLocation,
      ...props
    } = this.props;
    const valueFromLocation = locationSelector(customLocation);
    const { Component = catchAll, matched = valueFromLocation } =
      match(childRoutes || new Map(), indexRoute, valueFromLocation) || {};
    return (
      <Component {...props} matched={matched} customLocation={customLocation} />
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps)(_Switch);
