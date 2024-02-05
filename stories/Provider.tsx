import React, { PropsWithChildren } from 'react';

import { Provider } from 'react-redux';
import { Store } from 'redux';

type Props = PropsWithChildren<{
  store: Store<GlobalState>;
}>;
const ProviderWrapper = ({ children, store }: Props) => (
  <Provider store={store}>{children}</Provider>
);

export default ProviderWrapper;
