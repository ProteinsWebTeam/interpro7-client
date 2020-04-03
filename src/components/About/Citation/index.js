// @flow
import React from 'react';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

import {
  InterPro2019,
  InterProScan2014,
  PrintedInterPro2019,
  PrintedInterProScan2014,
} from 'components/Help/Publication';

const f = foundationPartial(local, fonts);

const Citation = () => (
  <section>
    <h3>Recent Publications</h3>
    <div className={f('flex-column')}>
      <InterPro2019 />
      <InterProScan2014 />
    </div>
    <div className={f('row')}>
      <h3 className={f('margin-top-large')}>How to cite</h3>
      <p>To cite InterPro, please refer to the following publication:</p>
      <PrintedInterPro2019 />
      <p>To cite InterProScan, please refer to the following publication:</p>
      <PrintedInterProScan2014 />
    </div>
  </section>
);

export default Citation;
