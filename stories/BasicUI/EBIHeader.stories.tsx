import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EBIHeader from 'components/EBIHeader';
import Provider from '../Provider';
import configureStore from '../configureStore';

const store = configureStore();

const meta = {
  title: 'Basic UI/EBIHeader',
  component: EBIHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <link
          rel="stylesheet"
          href="https://assets.emblstatic.net/vf/v2.5.10/assets/ebi-header-footer/ebi-header-footer.css"
        />
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof EBIHeader>;

export default meta;
type EBIHeaderStory = StoryObj<typeof meta>;

export const Base: EBIHeaderStory = {};
