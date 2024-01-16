import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

const meta = {
  title: 'Basic UI/FullScreen',
  component: FullScreenButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FullScreenButton>;

export default meta;
type FullScreenStory = StoryObj<typeof meta>;

export const Base: FullScreenStory = {
  args: {
    element: 'the-id-of-the-element',
    tooltip: 'View it in full screen mode',
  },
  render: (args) => {
    return (
      <>
        <div
          id={args.element as string}
          style={{
            backgroundColor: 'blue',
            color: 'orange',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Content... 🙈
        </div>
        <FullScreenButton {...args} />
      </>
    );
  },
};
export const WithHooks: FullScreenStory = {
  args: {
    element: 'the-id-of-the-element',
    tooltip: 'View it in full screen mode',
  },
  render: (args) => {
    return (
      <>
        <div
          id={args.element as string}
          style={{
            backgroundColor: 'blue',
            color: 'orange',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Content... 🙈
        </div>
        <FullScreenButton
          {...args}
          onFullScreenHook={() => {
            const element = document.getElementById(args.element as string);
            if (element) element.style.backgroundColor = 'green';
          }}
          onExitFullScreenHook={() => {
            const element = document.getElementById(args.element as string);
            if (element) element.style.backgroundColor = '';
          }}
        />
      </>
    );
  },
};
