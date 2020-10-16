import React from 'react';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

export default {
  title: 'Basic UI/InfoBlock',
};

export const Basic = () => (
  <div
    className={f('callout', 'info')}
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <i
      className="icon icon-common"
      data-icon="&#xf230;"
      style={{ marginRight: '2px' }}
    />{' '}
    Announcement: Storybook is here!
  </div>
);
