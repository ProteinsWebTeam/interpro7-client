import React, {Component, PropTypes as T} from 'react';
import {findDOMNode} from 'react-dom';
import styles from 'styles/blocks.css';
import seqStyles from './style.css';

import ReadMoreCard from '../../ReadMoreCard';
import SequenceIndex from '../SequenceIndex';
import _DOMAttributeChecker from 'higherOrder/DOMAttributeChecker';

const RATIO = 0.6;

const _formatSequence = (sequence, wordSize) =>
  sequence.replace(
    new RegExp(`(.{${wordSize}})`, 'g'),
    '$1 '
  );

const Seq = ({parent, children}) => {
  parent.refreshIndexes();
  return (
    <div
      className={seqStyles.sequence}
      ref={c => parent.setSeqComp(c)}
    >
      {_formatSequence(children, parent.state.wordSize)}
    </div>);
};
Seq.propTypes = {
  parent: T.object,
  children: T.node,
};

const Wrapped = _DOMAttributeChecker('clientWidth')(Seq);

export default class Sequence extends Component {
  static propTypes = {
    children: T.node,
  };

  state = {
    numberOfLines: 1,
    wordSize: 10,
  }

  refreshIndexes() {
    requestAnimationFrame(() => {
      const element = findDOMNode(this.seq_component);
      if (!element) return;
      const charW = parseFloat(
        window.getComputedStyle(element).getPropertyValue('font-size')
      ) * RATIO, // X-width using Courier font
        wordW = charW * (1 + this.state.wordSize),
        wordsPerLine = Math.floor(element.offsetWidth / wordW),
        lineLength = wordsPerLine * this.state.wordSize,
        numberOfLines = Math.ceil(this.props.children.length / lineLength);

      this.seq_index.setState({
        lineLength,
        numberOfLines,
      });
    });
  }

  setSeqComp(c) {
    this.seq_component = c;
  }

  setNumberOfLines(n) {
    this.state.setState({numberOfLines: n});
  }

  render() {
    const {children} = this.props;
    return (
      <ReadMoreCard>
        <div className={styles.content}>
          <h3>Sequence</h3>
          <div className={seqStyles.sequence_block}>
            <div className={seqStyles.sequence_index}>
              <SequenceIndex
                ref={c => {
                  this.seq_index = c;
                }}
              />
            </div>
            <Wrapped parent={this}>{children}</Wrapped>
          </div>
        </div>
      </ReadMoreCard>
    );
  }
}
