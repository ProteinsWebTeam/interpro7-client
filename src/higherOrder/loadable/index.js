import React from 'react';
import LoadingComponent from 'components/SimpleCommonComponents/Loading';

const Empty = React.PureComponent('Empty');

const loadable = ({ loader, loading }) /*: Object */ => {
  if (!loader) return Empty;
  const Loaded = React.lazy(loader);
  const Loading = loading || LoadingComponent;
  const Loadable = (props) => {
    return (
      <React.Suspense fallback={<Loading />}>
        <Loaded {...props} />
      </React.Suspense>
    );
  };
  return React.memo(Loadable);
};

export default loadable;
