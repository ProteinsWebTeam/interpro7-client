import React from 'react';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

export default {
  title: 'Basic UI/Switch',
};

export const Basic = () => (
  <div className={f('switch', 'large')}>
    <input type="checkbox" className={f('switch-input')} id="switch-input" />
    <label className={f('switch-paddle')} htmlFor="switch-input">
      <span className={f('show-for-sr')}>Switch Example:</span>
      <span className={f('switch-active')} aria-hidden="true">
        On
      </span>
      <span className={f('switch-inactive')} aria-hidden="true">
        Off
      </span>
    </label>
  </div>
);
