import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import GoTerms from 'components/GoTerms';
import Provider from '../Provider';
import configureStore from '../configureStore';

const store = configureStore({ pathname: '/entry/interpro/ipr999999' });

const meta = {
  title: 'InterPro UI/GOTerms',
  component: GoTerms,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['entry', 'protein', 'structure', 'taxonomy', 'proteome', 'set'],
      control: { type: 'radio' },
    },
    db: {
      options: ['interpro', 'panther', 'pfam', 'cdd', 'uniprot', 'pdb'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof GoTerms>;

export default meta;
type GoTermsStory = StoryObj<typeof meta>;

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

export const Base: GoTermsStory = {
  args: {
    terms: data,
    type: 'entry',
    db: 'interpro',
  },
};
