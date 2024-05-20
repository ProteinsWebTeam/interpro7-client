import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'components/SimpleCommonComponents/Button';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

const meta = {
  title: 'Basic UI/DropDownButton',
  component: DropDownButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '150px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropDownButton>;

export default meta;
type DropDownButtonStory = StoryObj<typeof meta>;

export const Base: DropDownButtonStory = {
  args: {
    label: 'Select',
    fontSize: '0.8em',
    color: 'pink',
    children: (
      <>
        <Button icon="icon-coffee" size="small">
          Coffee
        </Button>
        <Button icon="icon-beer" size="small">
          Beer
        </Button>
      </>
    ),
  },
};
