import React from 'react';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Basic UI/Select',
};

export const Single = () => (
  <select onChange={action('Change single')} onBlur={action('Change single')}>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
);
export const Multiple = () => (
  <select
    onChange={action('Change Multiple')}
    onBlur={action('Change Multiple')}
    multiple
  >
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
);
