import React, { PureComponent } from 'react';

import { foundationPartial } from 'styles/foundation';

import style from './style.css';

const f = foundationPartial(style);

class Loading extends PureComponent {
  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          <div className={f('loading-spinner')}>
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
