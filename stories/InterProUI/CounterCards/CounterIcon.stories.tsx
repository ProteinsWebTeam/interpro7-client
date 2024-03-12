import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CounterIcon from 'components/SimpleCommonComponents/Card/CounterIcon';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/CounterIcon',
  component: CounterIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    endpoint: {
      control: 'radio',
      options: [
        'entry',
        'protein',
        'structure',
        'taxonomy',
        'proteome',
        'set',
        'domain architecture',
      ],
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof CounterIcon>;

export default meta;
type CounterIconStory = StoryObj<typeof meta>;

export const Base: CounterIconStory = {
  args: {
    endpoint: 'entry',
    count: Math.round(Math.random() * 10000),
    name: 'The Name',
    to: {
      description: {
        main: { key: 'entry' },
      },
    },
  },
};

export const Signature: CounterIconStory = {
  args: {
    endpoint: 'entry',
    count: Math.round(Math.random() * 10000),
    name: 'The Name',
    to: {
      description: {
        main: { key: 'entry' },
      },
    },
    db: 'pfam',
    signature: 'PF0000',
  },
};
