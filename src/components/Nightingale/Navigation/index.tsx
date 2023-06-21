import React from 'react';
import { createComponent } from '@lit-labs/react';
import NightingaleNavigationCE from '@nightingale-elements/nightingale-navigation';

export const NightingaleNavigation = createComponent({
  tagName: 'nightingale-navigation',
  elementClass: NightingaleNavigationCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleNavigation;
