import React from 'react';
import { createComponent } from '@lit-labs/react';
import NightingaleSequenceCE from '@nightingale-elements/nightingale-sequence';

export const NightingaleSequence = createComponent({
  tagName: 'nightingale-sequence',
  elementClass: NightingaleSequenceCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleSequence;
