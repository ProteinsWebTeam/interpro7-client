import React from 'react';
// import LoadingComponent from './LoadingComponent';
import LoadingComponent from 'components/SimpleCommonComponents/Loading';

const DEFAULT_DELAY = 200;
const DEFAULT_TIMEOUT = 15000;

// TODO: find better flow types
// TODO: Updating to flow ^0.85 makes this mandatory and reports many errors for connect()
const loadable = ({ loader, loading }) /*: Object */ => {
  if (!loader) return;
  const Loaded = React.lazy(loader);
  const Loading = loading || LoadingComponent;
  return React.memo(props => {
    return (
      <React.Suspense fallback={<Loading />}>
        <Loaded {...props} />
      </React.Suspense>
    );
  });
};

export default loadable;
