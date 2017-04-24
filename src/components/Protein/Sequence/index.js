import React from 'react';
import T from 'prop-types';

import {foundationPartial} from 'styles/foundation';
import pStyles from './style.css';

const f = foundationPartial(pStyles);

const comment = /^\s*[;>].*$/gm;
const whiteSpaces = /\s*/g;
const chunkOfTen = /.{1,10}/g;
// Split every 10 character
const formatSequence = sequence => sequence
  .replace(comment, '')
  .replace(whiteSpaces, '')
  .match(chunkOfTen)
  .map((e, i) => (
    <span key={i} className={f('sequence_word')}>{e} </span>
  ));

const Inner = ({sequence}) => (
  <div className={f('sequence')}>
    {sequence && formatSequence(sequence)}
  </div>
);
Inner.propTypes = {
  sequence: T.string.isRequired,
};

const Sequence = ({sequence}) => (
  <section id="sequence">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}><h4>Sequence</h4></div>
    </div>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <Inner sequence={sequence} />
      </div>
    </div>
    <br/>
  </section>
);
Sequence.propTypes = {
  wordSize: T.number,
  // accession: T.string.isRequired,
  sequence: T.string,
};

export default Sequence;
