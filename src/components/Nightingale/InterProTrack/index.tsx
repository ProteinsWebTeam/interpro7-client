import React from 'react';
import { createComponent } from '@lit/react';
import NightingaleInterproTrackCE from '@nightingale-elements/nightingale-interpro-track';

export const NightingaleInterproTrack = createComponent({
  tagName: 'nightingale-interpro-track',
  elementClass: NightingaleInterproTrackCE,
  react: React,
  // events: {
  //   onactivate: 'activate',
  //   onchange: 'change',
  // },
});

export default React.memo(NightingaleInterproTrack);
//export default NightingaleInterproTrack;
