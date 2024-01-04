import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleTrackCE from '@nightingale-elements/nightingale-track';

export const NightingaleTrack = createComponent({
  tagName: 'nightingale-track',
  elementClass: NightingaleTrackCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleTrack;
