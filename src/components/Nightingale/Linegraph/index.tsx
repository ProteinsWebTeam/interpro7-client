import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleLinegraphTrackCE from '@nightingale-elements/nightingale-linegraph-track';

export const NightingaleLinegraphTrack = createComponent({
  tagName: 'nightingale-linegraph-track',
  elementClass: NightingaleLinegraphTrackCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default NightingaleLinegraphTrack;
