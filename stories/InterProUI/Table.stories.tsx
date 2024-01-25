import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Column } from 'components/Table';
import SimpleTable from 'components/Table/SimpleTable';

const meta = {
  title: 'InterPro UI/Table/Simple',
  component: SimpleTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleTable>;

export default meta;
type SimpleTableStory = StoryObj<typeof meta>;

const basicData = [
  { id: 1, name: 'First', extra: 0.25 },
  { id: 2, name: 'Second', extra: 0.5 },
  { id: 3, name: 'Third', extra: 0.75 },
  { id: 4, name: 'Fourth', extra: 0.5 },
];

export const TheSimpleTable: SimpleTableStory = {
  args: {
    dataTable: basicData,
    children: [
      <Column key="id" dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>,
      <Column key="name" dataKey="name" headerStyle={{ top: 0 }}>
        Name
      </Column>,
    ],
  },
};

export const TheSimpleTableWIthRenderers: SimpleTableStory = {
  args: {
    dataTable: basicData,
    children: [
      <Column dataKey="id" headerStyle={{ top: 0 }}>
        ID
      </Column>,
      <Column dataKey="name" headerStyle={{ top: 0 }}>
        Name
      </Column>,
      <Column
        dataKey="extra"
        headerStyle={{ top: 0 }}
        renderer={(extra: number) => <span>{extra * 100}%</span>}
      >
        Percentage
      </Column>,
    ],
  },
};
