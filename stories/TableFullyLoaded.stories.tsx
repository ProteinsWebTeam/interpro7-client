import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';

import Provider from './Provider';
import configureStore from './configureStore';
const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});

const meta = {
  title: 'InterPro UI/Table/FullyLoaded',
  component: FullyLoadedTable,
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
} satisfies Meta<typeof FullyLoadedTable>;

export default meta;
type TableFullyloadedStory = StoryObj<typeof meta>;

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 0.5 },
];

export const TheTable: TableFullyloadedStory = {
  args: {
    data: basicData,
    renderers: {
      extra: (extra: number) => <span>{extra * 100}%</span>,
    },
    // The top:0 in the headerStyle is added to * all columns reset the sticky that compensates the InterPro header
    headerStyle: {
      '*': { top: 0 },
    },
  },
};
