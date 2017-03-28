import React, {PropTypes as T} from 'react';

import loadData from 'higherOrder/loadData';

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

const Inner = ({data: {payload}}) => (
  <div className={f('sequence')}>
    {payload && formatSequence(payload)}
  </div>
);
Inner.propTypes = {
  data: T.shape({
    payload: T.string.isRequired,
  }).isRequired,
};

const urlFromState = accession => () => (
  `//www.uniprot.org/uniprot/${accession}.fasta`
);
const InnerWithData = ({accession, sequence}) => {
  if (sequence) return <Inner data={{payload: sequence}} />;
  const loadDataParams = {
    getUrl: urlFromState(accession),
    fetchOptions: {responseType: 'text'},
  };
  const Component = loadData(loadDataParams)(Inner);
  return <Component />;
};
InnerWithData.propTypes = {
  accession: T.string.isRequired,
  sequence: T.string,
};

const Sequence = ({accession, sequence}) => (
  <section id="sequence">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}><h4>Sequence</h4></div>
    </div>
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <InnerWithData accession={accession} sequence={sequence} />
      </div>
    </div>
    <br/>
  </section>
);
Sequence.propTypes = {
  wordSize: T.number,
  accession: T.string.isRequired,
  sequence: T.string,
};

export default Sequence;
