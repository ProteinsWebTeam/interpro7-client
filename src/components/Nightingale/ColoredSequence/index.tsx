import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleColoredSequenceCE from '@nightingale-elements/nightingale-colored-sequence';

export const NightingaleColoredSequence = createComponent({
  tagName: 'nightingale-colored-sequence',
  elementClass: NightingaleColoredSequenceCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleColoredSequence;
