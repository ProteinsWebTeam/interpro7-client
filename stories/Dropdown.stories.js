import React from 'react';

import { action } from '@storybook/addon-actions';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import { foundationPartial } from '../src/styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts);

export default {
  title: 'Basic UI/Dropdown',
};

export const Basic = () => (
  <DropDownButton label="Menu">Any HTML or JSX content</DropDownButton>
);
export const WithIcon = () => (
  <DropDownButton label="Menu" icon="&#xf000;">
    Any HTML or JSX content
  </DropDownButton>
);
export const WithColor = () => (
  <DropDownButton label="Menu" icon="&#xf000;" color="red">
    Any HTML or JSX content
  </DropDownButton>
);
export const WithFontSize = () => (
  <DropDownButton label="Menu" icon="&#xf000;" fontSize="2em">
    Any HTML or JSX content
  </DropDownButton>
);
export const WithButtons = () => (
  <DropDownButton label="Menu" icon="&#xf000;">
    <button
      className={f('icon', 'icon-common')}
      data-icon="&#xf0f4;"
      onClick={action('coffee!!!')}
    >
      {' '}
      Gimme Coffee!
    </button>
    <hr />
    <button
      className={f('icon', 'icon-common')}
      data-icon="&#xf0fc;"
      onClick={action('Beer!!!')}
    >
      {' '}
      Gimme Beer!
    </button>
  </DropDownButton>
);
