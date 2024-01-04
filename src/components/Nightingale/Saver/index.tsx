import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleSaverCE from '@nightingale-elements/nightingale-saver';

export const NightingaleSaver = createComponent({
  tagName: 'nightingale-saver',
  elementClass: NightingaleSaverCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleSaver;
