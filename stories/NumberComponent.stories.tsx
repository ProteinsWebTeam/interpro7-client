import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import NumberComponent from 'components/NumberComponent';
import Provider from './Provider';
import configureStore from './configureStore';

const store = configureStore({ pathname: '/entry/interpro/ipr999999' });

const meta = {
  title: 'InterPro UI/NumberComponent',
  component: NumberComponent,
  parameters: {
    layout: 'centered',
  },
  // TODO: Enable when Link gets migrated to TS to be able to include TS
  // tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof NumberComponent>;

export default meta;
type NumberStory = StoryObj<typeof meta>;

export const Base: NumberStory = {
  args: {
    children: 312979,
  },
};
export const NoAnimation: NumberStory = {
  args: {
    children: 312979,
    noAnimation: true,
  },
};
export const Approximation: NumberStory = {
  args: {
    children: 312979,
    abbr: true,
  },
};
export const AsLabel: NumberStory = {
  args: {
    children: 312979,
    abbr: true,
    label: true,
  },
};
export const IsLoading: NumberStory = {
  args: {
    children: 312979,
    abbr: true,
    label: true,
    loading: true,
  },
};
