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

class _OldSwitch extends PureComponent {
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

const oldMapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export const OldSwitch = connect(oldMapStateToProps)(_OldSwitch);

// export default connect(mapStateToProps)(Switch);
