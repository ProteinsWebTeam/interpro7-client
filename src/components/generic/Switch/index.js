import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const defaultCatchAll = () => <div>404</div>;

const match = (childRoutes, indexRoute, valueFromLocation) => {
  if (!valueFromLocation) return { Component: indexRoute };
  for (const { value, component } of childRoutes) {
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

class Switch extends PureComponent {
  static propTypes = {
    indexRoute: T.func.isRequired,
    locationSelector: T.func.isRequired,
    childRoutes: T.oneOfType([
      T.shape({
        [Symbol.iterator]: T.func.isRequired,
      }),
      T.array,
    ]) /* any Iterable, like a Set or an Array */,
    catchAll: T.func,
    location: T.object.isRequired,
  };

  render() {
    const {
      indexRoute,
      locationSelector,
      childRoutes = [],
      catchAll = defaultCatchAll,
      location,
      ...props
    } = this.props;
    const valueFromLocation = locationSelector(location);
    const { Component = catchAll, matched = valueFromLocation } =
      match(childRoutes, indexRoute, valueFromLocation) || {};
    return <Component {...props} matched={matched} location={location} />;
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps)(Switch);
