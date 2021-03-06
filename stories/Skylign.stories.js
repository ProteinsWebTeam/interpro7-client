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
    [
      'W:0.003',
      'M:0.008',
      'F:0.010',
      'C:0.011',
      'Y:0.011',
      'I:0.014',
      'H:0.016',
      'L:0.020',
      'P:0.023',
      'V:0.026',
      'R:0.028',
      'Q:0.032',
      'K:0.040',
      'T:0.049',
      'G:0.050',
      'E:0.070',
      'D:0.072',
      'S:0.073',
      'A:0.118',
      'N:2.051',
    ],
    [
      'W:0.003',
      'D:0.003',
      'P:0.005',
      'H:0.005',
      'N:0.006',
      'E:0.006',
      'Q:0.007',
      'R:0.007',
      'K:0.008',
      'C:0.010',
      'Y:0.010',
      'M:0.016',
      'F:0.017',
      'S:0.024',
      'G:0.026',
      'T:0.027',
      'A:0.033',
      'I:0.057',
      'V:0.062',
      'L:0.120',
    ],
    [
      'W:0.005',
      'D:0.005',
      'P:0.007',
      'H:0.007',
      'E:0.009',
      'N:0.009',
      'Q:0.010',
      'R:0.011',
      'K:0.011',
      'G:0.014',
      'C:0.014',
      'Y:0.019',
      'S:0.021',
      'F:0.032',
      'T:0.034',
      'A:0.043',
      'I:0.050',
      'V:0.080',
      'M:0.080',
      'L:0.207',
    ],
    [
      'W:0.005',
      'D:0.007',
      'H:0.008',
      'P:0.009',
      'C:0.011',
      'N:0.011',
      'Q:0.012',
      'E:0.013',
      'G:0.013',
      'R:0.013',
      'K:0.015',
      'Y:0.015',
      'F:0.023',
      'M:0.024',
      'T:0.041',
      'S:0.067',
      'A:0.081',
      'L:0.100',
      'I:0.106',
      'V:0.493',
    ],
    [
      'W:0.004',
      'D:0.004',
      'H:0.007',
      'P:0.007',
      'E:0.008',
      'N:0.008',
      'Q:0.009',
      'G:0.010',
      'R:0.010',
      'K:0.010',
      'Y:0.014',
      'S:0.019',
      'T:0.025',
      'M:0.031',
      'A:0.038',
      'C:0.044',
      'F:0.090',
      'V:0.110',
      'I:0.170',
      'L:0.180',
    ],
    [
      'D:0.004',
      'P:0.006',
      'E:0.007',
      'N:0.007',
      'Q:0.007',
      'G:0.008',
      'H:0.008',
      'R:0.008',
      'K:0.011',
      'W:0.022',
      'F:0.023',
      'M:0.027',
      'S:0.027',
      'C:0.029',
      'T:0.033',
      'A:0.047',
      'I:0.048',
      'Y:0.060',
      'V:0.060',
      'L:0.067',
    ],
    [
      'W:0.003',
      'D:0.005',
      'P:0.006',
      'C:0.006',
      'H:0.006',
      'N:0.008',
      'R:0.009',
      'E:0.009',
      'G:0.010',
      'Y:0.010',
      'K:0.011',
      'Q:0.013',
      'M:0.014',
      'F:0.014',
      'S:0.027',
      'T:0.040',
      'L:0.049',
      'I:0.051',
      'A:0.084',
      'V:0.119',
    ],
    [
      'W:0.004',
      'D:0.005',
      'P:0.007',
      'H:0.007',
      'C:0.008',
      'E:0.009',
      'Q:0.009',
      'G:0.010',
      'R:0.010',
      'K:0.011',
      'N:0.014',
      'Y:0.020',
      'M:0.022',
      'S:0.023',
      'T:0.031',
      'A:0.032',
      'F:0.074',
      'L:0.096',
      'V:0.111',
      'I:0.151',
    ],
    [
      'D:0.003',
      'P:0.004',
      'H:0.004',
      'W:0.004',
      'N:0.005',
      'Q:0.005',
      'E:0.006',
      'G:0.010',
      'R:0.010',
      'Y:0.011',
      'M:0.011',
      'K:0.012',
      'F:0.014',
      'C:0.015',
      'T:0.017',
      'S:0.021',
      'I:0.028',
      'V:0.029',
      'A:0.040',
      'L:0.063',
    ],
    [
      'W:0.002',
      'P:0.003',
      'C:0.003',
      'H:0.004',
      'D:0.004',
      'N:0.006',
      'G:0.007',
      'M:0.007',
      'F:0.007',
      'E:0.008',
      'Q:0.008',
      'I:0.008',
      'Y:0.008',
      'S:0.011',
      'A:0.013',
      'K:0.016',
      'L:0.016',
      'R:0.021',
      'V:0.021',
      'T:0.028',
    ],
    [
      'W:0.001',
      'C:0.001',
      'M:0.004',
      'I:0.005',
      'F:0.005',
      'P:0.007',
      'L:0.008',
      'G:0.010',
      'Y:0.011',
      'H:0.012',
      'V:0.012',
      'R:0.017',
      'D:0.018',
      'Q:0.021',
      'A:0.023',
      'T:0.025',
      'S:0.030',
      'N:0.032',
      'E:0.043',
      'K:0.048',
    ],
    [
      'W:0.001',
      'C:0.002',
      'F:0.004',
      'Y:0.006',
      'I:0.008',
      'M:0.009',
      'H:0.012',
      'V:0.013',
      'P:0.015',
      'G:0.016',
      'L:0.018',
      'D:0.020',
      'N:0.021',
      'T:0.028',
      'A:0.030',
      'Q:0.035',
      'E:0.036',
      'S:0.036',
      'R:0.070',
      'K:0.131',
    ],
    [
      'W:0.001',
      'C:0.003',
      'F:0.003',
      'M:0.004',
      'I:0.006',
      'P:0.006',
      'Y:0.008',
      'L:0.009',
      'G:0.012',
      'V:0.012',
      'D:0.016',
      'H:0.017',
      'N:0.019',
      'T:0.019',
      'Q:0.025',
      'A:0.029',
      'E:0.033',
      'R:0.048',
      'K:0.054',
      'S:0.059',
    ],
    [
      'W:0.003',
      'C:0.005',
      'H:0.006',
      'D:0.006',
      'P:0.007',
      'N:0.009',
      'Y:0.010',
      'Q:0.010',
      'G:0.012',
      'E:0.013',
      'R:0.014',
      'F:0.019',
      'S:0.020',
      'A:0.025',
      'I:0.027',
      'T:0.028',
      'K:0.029',
      'M:0.032',
      'V:0.035',
      'L:0.170',
    ],
    [
      'W:0.002',
      'C:0.004',
      'F:0.005',
      'M:0.006',
      'Y:0.006',
      'P:0.009',
      'I:0.010',
      'V:0.014',
      'G:0.019',
      'D:0.022',
      'L:0.022',
      'N:0.022',
      'T:0.023',
      'A:0.028',
      'S:0.029',
      'H:0.036',
      'E:0.042',
      'K:0.064',
      'Q:0.096',
      'R:0.098',
    ],
    [
      'W:0.004',
      'F:0.005',
      'C:0.006',
      'M:0.007',
      'P:0.008',
      'I:0.009',
      'H:0.010',
      'Y:0.012',
      'V:0.014',
      'G:0.014',
      'L:0.015',
      'D:0.022',
      'A:0.027',
      'Q:0.028',
      'R:0.034',
      'E:0.034',
      'K:0.039',
      'N:0.040',
      'S:0.050',
      'T:0.134',
    ],
    [
      'W:0.001',
      'C:0.002',
      'H:0.003',
      'G:0.004',
      'F:0.005',
      'D:0.006',
      'N:0.006',
      'R:0.006',
      'Q:0.007',
      'M:0.008',
      'K:0.010',
      'E:0.011',
      'I:0.011',
      'Y:0.012',
      'L:0.016',
      'A:0.017',
      'T:0.019',
      'P:0.024',
      'V:0.031',
      'S:0.031',
    ],
    [
      'W:0.002',
      'H:0.005',
      'D:0.007',
      'C:0.007',
      'Y:0.007',
      'G:0.008',
      'R:0.009',
      'Q:0.010',
      'E:0.012',
      'K:0.013',
      'P:0.015',
      'F:0.017',
      'I:0.022',
      'M:0.024',
      'V:0.025',
      'S:0.027',
      'L:0.027',
      'N:0.027',
      'A:0.032',
      'T:0.088',
    ],
    [
      'W:0.002',
      'C:0.003',
      'M:0.007',
      'F:0.008',
      'I:0.009',
      'P:0.009',
      'G:0.014',
      'V:0.015',
      'L:0.020',
      'H:0.022',
      'Q:0.028',
      'R:0.030',
      'T:0.032',
      'A:0.032',
      'Y:0.035',
      'D:0.037',
      'S:0.037',
      'K:0.042',
      'E:0.043',
      'N:0.145',
    ],
    [
      'W:0.003',
      'D:0.004',
      'P:0.006',
      'E:0.008',
      'Q:0.008',
      'G:0.008',
      'H:0.008',
      'N:0.010',
      'K:0.011',
      'M:0.015',
      'C:0.015',
      'S:0.016',
      'A:0.026',
      'T:0.038',
      'F:0.039',
      'R:0.047',
      'V:0.047',
      'L:0.053',
      'I:0.063',
      'Y:0.076',
    ],
    [
      'D:0.006',
      'C:0.007',
      'P:0.007',
      'E:0.008',
      'K:0.010',
      'G:0.010',
      'R:0.011',
      'Q:0.011',
      'N:0.012',
      'M:0.018',
      'S:0.019',
      'T:0.019',
      'A:0.024',
      'W:0.030',
      'V:0.037',
      'H:0.041',
      'I:0.046',
      'Y:0.308',
      'L:0.476',
      'F:0.610',
    ],
    [
      'W:0.005',
      'D:0.005',
      'H:0.007',
      'P:0.007',
      'N:0.009',
      'E:0.009',
      'C:0.009',
      'Q:0.009',
      'G:0.010',
      'K:0.011',
      'R:0.014',
      'Y:0.014',
      'S:0.025',
      'T:0.027',
      'F:0.031',
      'A:0.034',
      'M:0.058',
      'V:0.177',
      'L:0.203',
      'I:0.222',
    ],
  ],
  // eslint-disable-next-line no-magic-numbers
  insert_probs: [0.00596056502229412],
  // eslint-disable-next-line no-magic-numbers
  insert_lengths: [1.8581623400433067],
  // eslint-disable-next-line no-magic-numbers
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
    [
      'W:0.001',
      'M:0.003',
      'F:0.004',
      'C:0.004',
      'Y:0.004',
      'I:0.005',
      'H:0.006',
      'L:0.007',
      'P:0.008',
      'V:0.010',
      'R:0.010',
      'Q:0.012',
      'K:0.015',
      'T:0.018',
      'G:0.019',
      'E:0.026',
      'D:0.026',
      'S:0.027',
      'A:0.043',
      'N:0.753',
    ],
    [
      'W:0.007',
      'D:0.008',
      'P:0.011',
      'H:0.011',
      'N:0.014',
      'E:0.014',
      'Q:0.015',
      'R:0.017',
      'K:0.017',
      'C:0.021',
      'Y:0.022',
      'M:0.035',
      'F:0.038',
      'S:0.052',
      'G:0.057',
      'T:0.059',
      'A:0.074',
      'I:0.126',
      'V:0.137',
      'L:0.266',
    ],
    [
      'W:0.007',
      'D:0.007',
      'P:0.011',
      'H:0.011',
      'E:0.013',
      'N:0.013',
      'Q:0.014',
      'R:0.016',
      'K:0.016',
      'G:0.020',
      'C:0.021',
      'Y:0.028',
      'S:0.031',
      'F:0.048',
      'T:0.051',
      'A:0.064',
      'I:0.075',
      'V:0.120',
      'M:0.120',
      'L:0.311',
    ],
    [
      'W:0.004',
      'D:0.007',
      'H:0.008',
      'P:0.008',
      'C:0.010',
      'N:0.011',
      'Q:0.011',
      'E:0.012',
      'G:0.012',
      'R:0.012',
      'K:0.014',
      'Y:0.014',
      'F:0.022',
      'M:0.023',
      'T:0.039',
      'S:0.063',
      'A:0.076',
      'L:0.094',
      'I:0.099',
      'V:0.462',
    ],
    [
      'W:0.005',
      'D:0.006',
      'H:0.008',
      'P:0.009',
      'E:0.010',
      'N:0.010',
      'Q:0.011',
      'G:0.012',
      'R:0.012',
      'K:0.012',
      'Y:0.017',
      'S:0.024',
      'T:0.032',
      'M:0.039',
      'A:0.048',
      'C:0.055',
      'F:0.112',
      'V:0.138',
      'I:0.214',
      'L:0.226',
    ],
    [
      'D:0.007',
      'P:0.011',
      'E:0.013',
      'N:0.014',
      'Q:0.015',
      'G:0.016',
      'H:0.016',
      'R:0.016',
      'K:0.021',
      'W:0.043',
      'F:0.045',
      'M:0.052',
      'S:0.053',
      'C:0.057',
      'T:0.065',
      'A:0.093',
      'I:0.094',
      'Y:0.118',
      'V:0.118',
      'L:0.133',
    ],
    [
      'W:0.006',
      'D:0.010',
      'P:0.011',
      'C:0.012',
      'H:0.012',
      'N:0.016',
      'R:0.019',
      'E:0.019',
      'G:0.020',
      'Y:0.021',
      'K:0.022',
      'Q:0.026',
      'M:0.029',
      'F:0.029',
      'S:0.055',
      'T:0.081',
      'L:0.099',
      'I:0.104',
      'A:0.169',
      'V:0.241',
    ],
    [
      'W:0.007',
      'D:0.007',
      'P:0.011',
      'H:0.011',
      'C:0.013',
      'E:0.013',
      'Q:0.014',
      'G:0.015',
      'R:0.016',
      'K:0.016',
      'N:0.021',
      'Y:0.030',
      'M:0.034',
      'S:0.035',
      'T:0.048',
      'A:0.050',
      'F:0.113',
      'L:0.146',
      'V:0.170',
      'I:0.231',
    ],
    [
      'D:0.009',
      'P:0.011',
      'H:0.012',
      'W:0.014',
      'N:0.015',
      'Q:0.016',
      'E:0.020',
      'G:0.031',
      'R:0.033',
      'Y:0.034',
      'M:0.035',
      'K:0.038',
      'F:0.044',
      'C:0.049',
      'T:0.054',
      'S:0.069',
      'I:0.090',
      'V:0.094',
      'A:0.129',
      'L:0.203',
    ],
    [
      'W:0.008',
      'P:0.013',
      'C:0.017',
      'H:0.020',
      'D:0.022',
      'N:0.029',
      'G:0.033',
      'M:0.034',
      'F:0.036',
      'E:0.039',
      'Q:0.040',
      'I:0.041',
      'Y:0.041',
      'S:0.054',
      'A:0.064',
      'K:0.079',
      'L:0.082',
      'R:0.105',
      'V:0.105',
      'T:0.138',
    ],
    [
      'W:0.003',
      'C:0.004',
      'M:0.011',
      'I:0.014',
      'F:0.017',
      'P:0.022',
      'L:0.024',
      'G:0.029',
      'Y:0.032',
      'H:0.036',
      'V:0.037',
      'R:0.050',
      'D:0.053',
      'Q:0.064',
      'A:0.069',
      'T:0.076',
      'S:0.089',
      'N:0.096',
      'E:0.130',
      'K:0.145',
    ],
    [
      'W:0.003',
      'C:0.004',
      'F:0.009',
      'Y:0.012',
      'I:0.015',
      'M:0.017',
      'H:0.024',
      'V:0.026',
      'P:0.029',
      'G:0.031',
      'L:0.036',
      'D:0.040',
      'N:0.041',
      'T:0.055',
      'A:0.059',
      'Q:0.068',
      'E:0.070',
      'S:0.070',
      'R:0.138',
      'K:0.255',
    ],
    [
      'W:0.003',
      'C:0.008',
      'F:0.009',
      'M:0.011',
      'I:0.014',
      'P:0.016',
      'Y:0.021',
      'L:0.024',
      'G:0.031',
      'V:0.031',
      'D:0.041',
      'H:0.045',
      'N:0.049',
      'T:0.050',
      'Q:0.066',
      'A:0.076',
      'E:0.086',
      'R:0.125',
      'K:0.141',
      'S:0.154',
    ],
    [
      'W:0.006',
      'C:0.011',
      'H:0.013',
      'D:0.013',
      'P:0.015',
      'N:0.019',
      'Y:0.020',
      'Q:0.021',
      'G:0.026',
      'E:0.028',
      'R:0.029',
      'F:0.040',
      'S:0.042',
      'A:0.051',
      'I:0.057',
      'T:0.058',
      'K:0.061',
      'M:0.066',
      'V:0.072',
      'L:0.352',
    ],
    [
      'W:0.003',
      'C:0.008',
      'F:0.008',
      'M:0.011',
      'Y:0.011',
      'P:0.016',
      'I:0.019',
      'V:0.025',
      'G:0.034',
      'D:0.039',
      'L:0.039',
      'N:0.040',
      'T:0.040',
      'A:0.051',
      'S:0.052',
      'H:0.064',
      'E:0.076',
      'K:0.115',
      'Q:0.172',
      'R:0.177',
    ],
    [
      'W:0.008',
      'F:0.010',
      'C:0.012',
      'M:0.013',
      'P:0.016',
      'I:0.018',
      'H:0.019',
      'Y:0.023',
      'V:0.026',
      'G:0.027',
      'L:0.029',
      'D:0.043',
      'A:0.053',
      'Q:0.055',
      'R:0.066',
      'E:0.067',
      'K:0.077',
      'N:0.078',
      'S:0.097',
      'T:0.261',
    ],
    [
      'W:0.005',
      'C:0.009',
      'H:0.015',
      'G:0.019',
      'F:0.022',
      'D:0.025',
      'N:0.025',
      'R:0.028',
      'Q:0.029',
      'M:0.037',
      'K:0.043',
      'E:0.047',
      'I:0.048',
      'Y:0.050',
      'L:0.069',
      'A:0.073',
      'T:0.083',
      'P:0.103',
      'V:0.134',
      'S:0.137',
    ],
    [
      'W:0.006',
      'H:0.014',
      'D:0.018',
      'C:0.018',
      'Y:0.019',
      'G:0.022',
      'R:0.025',
      'Q:0.025',
      'E:0.031',
      'K:0.033',
      'P:0.040',
      'F:0.043',
      'I:0.058',
      'M:0.062',
      'V:0.065',
      'S:0.070',
      'L:0.070',
      'N:0.070',
      'A:0.083',
      'T:0.228',
    ],
    [
      'W:0.003',
      'C:0.005',
      'M:0.012',
      'F:0.015',
      'I:0.016',
      'P:0.016',
      'G:0.024',
      'V:0.027',
      'L:0.035',
      'H:0.038',
      'Q:0.049',
      'R:0.052',
      'T:0.056',
      'A:0.056',
      'Y:0.061',
      'D:0.065',
      'S:0.066',
      'K:0.075',
      'E:0.076',
      'N:0.254',
    ],
    [
      'W:0.007',
      'D:0.009',
      'P:0.011',
      'E:0.016',
      'Q:0.016',
      'G:0.016',
      'H:0.017',
      'N:0.020',
      'K:0.022',
      'M:0.030',
      'C:0.030',
      'S:0.033',
      'A:0.051',
      'T:0.076',
      'F:0.078',
      'R:0.093',
      'V:0.094',
      'L:0.105',
      'I:0.126',
      'Y:0.150',
    ],
    [
      'D:0.003',
      'C:0.004',
      'P:0.004',
      'E:0.005',
      'K:0.006',
      'G:0.006',
      'R:0.006',
      'Q:0.007',
      'N:0.007',
      'M:0.011',
      'S:0.011',
      'T:0.011',
      'A:0.014',
      'W:0.018',
      'V:0.022',
      'H:0.024',
      'I:0.027',
      'Y:0.180',
      'L:0.278',
      'F:0.356',
    ],
    [
      'W:0.005',
      'D:0.005',
      'H:0.008',
      'P:0.008',
      'N:0.010',
      'E:0.010',
      'C:0.010',
      'Q:0.011',
      'G:0.011',
      'K:0.012',
      'R:0.016',
      'Y:0.016',
      'S:0.028',
      'T:0.031',
      'F:0.035',
      'A:0.039',
      'M:0.065',
      'V:0.200',
      'L:0.229',
      'I:0.252',
    ],
    [
      'W:0.007',
      'D:0.008',
      'P:0.011',
      'H:0.011',
      'N:0.014',
      'E:0.014',
      'R:0.017',
      'K:0.017',
      'Q:0.020',
      'Y:0.022',
      'F:0.042',
      'M:0.043',
      'S:0.046',
      'G:0.057',
      'T:0.057',
      'C:0.061',
      'A:0.070',
      'I:0.114',
      'V:0.149',
      'L:0.222',
    ],
    [
      'W:0.003',
      'C:0.005',
      'F:0.008',
      'Y:0.010',
      'I:0.014',
      'P:0.014',
      'M:0.016',
      'V:0.021',
      'L:0.022',
      'H:0.033',
      'R:0.034',
      'T:0.036',
      'D:0.038',
      'Q:0.038',
      'G:0.044',
      'A:0.047',
      'K:0.054',
      'E:0.058',
      'N:0.228',
      'S:0.277',
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
