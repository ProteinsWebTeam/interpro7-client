import React from 'react';

import { action } from '@storybook/addon-actions';
// import { Button } from '@storybook/react/demo';

import { foundationPartial } from '../src/styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts);

export default {
  title: 'Basic UI/Button',
};

export const Basic = () => (
  <button className={f('button')} onClick={action('clicked basic')}>
    Basic
  </button>
);
export const Secondary = () => (
  <button className={f('button secondary')} onClick={action('clicked basic')}>
    Secondary
  </button>
);
export const JustIcon = () => (
  <button
    className={f('icon', 'icon-common', 'ico-neutral', 'margin-left-large')}
    data-icon="&#xf0f4;"
    onClick={action('clicked icon')}
  />
);

export const IconAndText = () => (
  <button
    className={f('button', 'icon', 'icon-common')}
    data-icon="&#xf0f4;"
    onClick={action('clicked icon+text')}
  >
    {' '}
    Gimme Coffee!
  </button>
);
