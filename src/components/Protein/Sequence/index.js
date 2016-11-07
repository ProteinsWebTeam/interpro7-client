import React, {PropTypes as T} from 'react';

import {foundationPartial} from 'styles/foundation';
import pStyles from './style.css';

const f = foundationPartial(pStyles);

const _formatSequence = sequence => (
  // Split every 10 character
  sequence.match(/.{1,10}/g).map((e, i) => (
    <span key={i} className={f('sequence_word')}>{e} </span>
  ))
);


const Sequence = ({children}) => (
  <section id="sequence">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}><h4>Sequence</h4></div>
    </div>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <div className={f('sequence')}>
          {children && _formatSequence(children)}
        </div>
      </div>
    </div>
    <br/>
  </section>
);
Sequence.propTypes = {
  wordSize: T.number,
  children: T.any,
};

export default Sequence;
