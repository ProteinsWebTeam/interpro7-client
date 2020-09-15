import React from 'react';

import NumberComponent from 'components/NumberComponent';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/NumberComponent',
  decorators: [withProvider],
};

export const Basic = () => <NumberComponent>{83132}</NumberComponent>;

export const NoAnimation = () => (
  <NumberComponent noAnimation={true}>{83132}</NumberComponent>
);

export const Approximation = () => (
  <NumberComponent abbr={true}>{83132}</NumberComponent>
);

export const AsLabel = () => (
  <NumberComponent abbr={true} label={true}>
    {83132}
  </NumberComponent>
);

export const IsLoading = () => (
  <NumberComponent abbr={true} label={true} loading={true}>
    {83132}
  </NumberComponent>
);
