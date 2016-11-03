import React, {PropTypes as T} from 'react';

import {foundationPartial} from 'styles/foundation';
import pStyles from './style.css';

const f = foundationPartial(pStyles);

const defaultWordSize = 10;

const _formatSequence = (sequence, wordSize) =>
  sequence.replace(
    new RegExp(`(.{${wordSize}})`, 'g'),
    '$1 '
  ).split(' ').map((e, i) => (
    <span key={i} start={wordSize * i} className={f('sequence_word')}>{e} </span>
  ));


const Sequence = ({wordSize = defaultWordSize, children}) => (
  <section id="sequence">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}><h4>Sequence</h4></div>
    </div>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <div className={f('sequence')}>
          {_formatSequence(children, wordSize)}
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
