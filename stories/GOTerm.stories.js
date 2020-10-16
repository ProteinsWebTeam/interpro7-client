import React from 'react';
import GoTerms from '../src/components/GoTerms';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/GOTerms',
  decorators: [withProvider],
};

const data = [
  {
    category: {
      code: 'P',
      name: 'biological_process',
    },
    identifier: 'GO:0019058',
    name: 'viral life cycle',
  },
  {
    category: {
      code: 'C',
      name: 'cellular_component',
    },
    identifier: 'GO:0042025',
    name: 'host cell nucleus',
  },
];
export const Basic = () => (
  <GoTerms terms={data} type={'entry'} db={'interpro'} />
);
