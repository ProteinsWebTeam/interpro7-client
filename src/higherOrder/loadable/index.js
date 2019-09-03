import React from 'react';
import LoadingComponent from 'components/SimpleCommonComponents/Loading';

const loadable = ({ loader, loading }) /*: Object */ => {
  if (!loader) return;
  const Loaded = React.lazy(loader);
  const Loading = loading || LoadingComponent;
  const Loadable = props => {
    return (
      <React.Suspense fallback={<Loading />}>
        <Loaded {...props} />
      </React.Suspense>
    );
  };
  return React.memo(Loadable);
};

export default loadable;
