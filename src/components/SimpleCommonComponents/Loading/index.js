// @flow
import React from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';

import style from './style.css';

const f = foundationPartial(style);

const Loading = ({ inline = false } /*: {inline?: boolean}*/) => (
  <div className={f('row')}>
    <div className={f('columns')}>
      <div className={f('loading-spinner', { inline })}>
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);
Loading.propTypes = {
  inline: T.bool,
};

export default Loading;
