import React from 'react';
import T from 'prop-types';

import { Provider } from 'react-redux';

const ProviderWrapper = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);
ProviderWrapper.propTypes = {
  children: T.any,
  store: T.object,
};

export default ProviderWrapper;
