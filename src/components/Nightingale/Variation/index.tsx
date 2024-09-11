import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleVariationCE from '@nightingale-elements/nightingale-variation';

export const NightingaleVariation = createComponent({
  tagName: 'nightingale-variation',
  elementClass: NightingaleVariationCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleVariation;
