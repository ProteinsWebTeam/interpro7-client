import React from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

export default {
  title: 'Basic UI/InfoBlock',
  decorators: [withKnobs],
};

const label = 'Type';
const options = {
  Secondary: 'secondary',
  Primary: 'primary',
  Success: 'success',
  Warning: 'warning',
  Alert: 'alert',
};
const defaultValue = 'secondary';
const groupId = 'GROUP-ID1';

export const Basic = () => (
  <div className={f('callout', select(label, options, defaultValue, groupId))}>
    <i
      className="icon icon-common"
      data-icon="&#xf230;"
      style={{ marginRight: '2px' }}
    />{' '}
    Announcement: Storybook is here!
  </div>
);

export const InDifferentSizes = () => (
  <div>
    <div className={f('callout', 'small', 'primary')}>
      <h5>This is a small callout</h5>
    </div>

    <div className={f('callout', 'large', 'warning')}>
      <h5>This is a large callout</h5>
    </div>
  </div>
);
