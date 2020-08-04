import React from 'react';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});
const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/Table/FullyLoaded',
  decorators: [withProvider],
};

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 0.5 },
];

export const TheFullyLoadedTable = () => (
  <FullyLoadedTable
    data={basicData}
    renderers={{
      // eslint-disable-next-line react/display-name
      extra: (extra) => <span>{extra * 100}%</span>,
    }}
    // The top:0 in the headerStyle is added to * all columns reset the sticky that compensates the InterPro header
    headerStyle={{
      '*': { top: 0 },
    }}
  />
);
