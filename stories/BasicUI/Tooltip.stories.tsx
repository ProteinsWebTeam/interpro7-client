import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Button from 'components/SimpleCommonComponents/Button';

const meta = {
  title: 'Basic UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type TooltipStory = StoryObj<typeof meta>;

export const Base: TooltipStory = {
  args: {
    children: 'Some text',
    title: 'The Info about it.',
  },
};
export const SupportsJSX: TooltipStory = {
  args: {
    children: <i>Some text</i>,
    title: (
      <>
        The <b style={{ color: 'red' }}>Info</b> about it.
      </>
    ),
  },
};
export const InteractiveJSX: TooltipStory = {
  args: {
    children: <i>Some text</i>,
    title: (
      <>
        <p>The info about it. </p>
        <p>
          But this time there is a <Button>Button</Button>{' '}
        </p>
        <p>
          So the tooltip needs to give time for the user to click it. <br />
          But this partticular one doesn't do anything
        </p>
      </>
    ),
    interactive: true,
  },
};
