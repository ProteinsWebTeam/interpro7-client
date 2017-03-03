import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

// get the next level in the pathname, after the base
const getLevel = (pathname/*: string*/, base/*: ?string*/)/*: ?string */ => {
  let baseMatched = !base;// false if a base is defined, true if no base
  // go through all the pathname levels
  for (const level of pathname.split('/').filter(i => i)) {
    // if the previous was the base, return this one
    if (baseMatched) return level;
    // if this one *is* the base, switch the flag to return the next one
    baseMatched = level.toLowerCase() === base;
  }
};

const getComponent = (
  level/*: ?string */,
  indexRoute/*: React.Component<*, *, *> */,
  childRoutes/*: ?Array<{path: string, component: React.Component<*, *, *>}> */
) => {
  // If nothing to match against, use the index route
  if (!level) return indexRoute;
  // Loop through all the possible child routes
  for (const {path, component} of childRoutes) {
    if (level.match(path)) {// if (path === level) {// got a match, so stop here and...
      return component;// return the corresponding component
    }
  }
  // return undefined
};

const defaultCatchAll = () => <div>404</div>;

const Switch = ({
  ...props,
  indexRoute,
  childRoutes = [],
  catchAll = defaultCatchAll,
  base = '',
}) => {
  // get the URL level
  const level = getLevel(props.location.pathname, base.toLowerCase());
  // get the component to render according to the level
  const Component = getComponent(level, indexRoute, childRoutes) || catchAll;
  //
  return <Component {...props} match={level} />;
};
Switch.propTypes = {
  indexRoute: T.func.isRequired,
  childRoutes: T.shape({
    [Symbol.iterator]: T.func.isRequired,
  })/* any Iterable, like a Set or an Array */,
  catchAll: T.func,
  base: T.string,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default connect(({location}) => ({location}))(Switch);
