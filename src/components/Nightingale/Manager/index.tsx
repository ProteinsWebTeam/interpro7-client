import React from 'react';
import { createComponent } from '@lit-labs/react';
import NightingaleManagerCE from '@nightingale-elements/nightingale-manager';

export const NightingaleManager = createComponent({
  tagName: 'nightingale-manager',
  elementClass: NightingaleManagerCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleManager;
