import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import InputGroup from 'components/DownloadForm/InputGroup';
import Button from 'components/SimpleCommonComponents/Button';

const meta = {
  title: 'Basic UI/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type CalloutStory = StoryObj<typeof meta>;

export const Base: CalloutStory = {
  args: {
    label: 'info',
    input: <input type="text"></input>,
    button: <Button>X</Button>,
  },
};
