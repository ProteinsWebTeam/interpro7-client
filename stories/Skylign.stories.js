import React, { useEffect } from 'react';

import Skylign from 'skylign';
import loadWebComponent from 'utils/load-web-component';

export default {
  title: 'InterPro UI/Skylign',
};
const data = {
  alphabet: 'aa',
  max_height_theory: 6.453114921518104,
  max_height_obs: 5.2996166606681,
  min_height_obs: 0,
  height_arr: [
    [
      'C:0.003',
      'W:0.004',
      'F:0.005',
      'Y:0.006',
      'M:0.006',
      'P:0.007',
      'H:0.008',
      'I:0.010',
      'V:0.015',
      'D:0.016',
      'L:0.016',
      'R:0.017',
      'Q:0.019',
      'N:0.019',
      'K:0.027',
      'A:0.031',
      'S:0.031',
      'T:0.035',
      'E:0.041',
      'G:0.133',
    ],
  ],
  insert_probs: [0.00596056502229412],
  insert_lengths: [1.8581623400433067],
  delete_probs: [0.9816169085786339],
  mmline: [0],
  ali_map: [1],
  height_calc: 'info_content_all',
  processing: 'hmm',
  probs_arr: [
    [
      'C:0.006',
      'W:0.008',
      'F:0.012',
      'Y:0.013',
      'M:0.014',
      'P:0.015',
      'H:0.018',
      'I:0.022',
      'V:0.033',
      'D:0.035',
      'L:0.036',
      'R:0.038',
      'Q:0.042',
      'N:0.043',
      'K:0.060',
      'A:0.069',
      'S:0.070',
      'T:0.077',
      'E:0.091',
      'G:0.296',
    ],
  ],
};

export const Basic = () => {
  useEffect(() => {
    loadWebComponent(() => Skylign).as('skylign-component');
  });
  return (
    <div>
      <skylign-component logo={JSON.stringify(data)} />
    </div>
  );
};
