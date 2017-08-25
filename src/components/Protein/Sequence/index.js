import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import pStyles from './style.css';

const f = foundationPartial(pStyles);

const comment = /^\s*[;>].*$/gm;
const whiteSpaces = /\s*/g;
const chunkOfTen = /.{1,10}/g;
// Split every 10 character
const formatSequence = sequence =>
  sequence
    .replace(comment, '')
    .replace(whiteSpaces, '')
    .match(chunkOfTen)
    .map((e, i, { length }) =>
      <span
        key={i}
        className={f('sequence_word')}
        style={{ zIndex: length - i }}
      >
        {e}
      </span>,
    );

const Inner = ({ sequence }) =>
  <div className={f('sequence')}>
    {sequence && formatSequence(sequence)}
  </div>;
Inner.propTypes = {
  sequence: T.string.isRequired,
};

class Sequence extends PureComponent {
  static propTypes = {
    wordSize: T.number,
    sequence: T.string,
  };

  _handleClick = event => {
    const { target } = event;
    const oldHref = target.href;
    if (!this._node) return;
    let sequenceToSearch = this.props.sequence;
    if ('getSelection' in window) {
      const selection = window.getSelection();
      const selectionIsInSequence =
        // Beginning of selection is in the sequence element
        this._node.contains(selection.anchorNode) &&
        // End of selection is in the sequence element
        this._node.contains(selection.focusNode);
      if (selectionIsInSequence) {
        // Get the text in the selection
        const selectionString = selection.toString().trim();
        if (selectionString) {
          sequenceToSearch = selectionString;
        }
      }
    }
    // Add the sequence as querystring to Hmmer link href
    target.href += `?seq=${sequenceToSearch}`;
    // Reset href, but after the click was done
    setTimeout(() => (target.href = oldHref));
  };

  render() {
    const { sequence } = this.props;
    return (
      <section id="sequence">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>Sequence</h4>
          </div>
        </div>
        <div className={f('row')}>
          <div
            className={f('large-10', 'columns')}
            ref={node => (this._node = node)}
          >
            <Inner sequence={sequence} />
          </div>
          <div className={f('large-2', 'columns')}>
            <Link
              className={f('button', 'hollow', 'hmmer-link')}
              href="https://www.ebi.ac.uk/Tools/hmmer/search/phmmer"
              onClick={this._handleClick}
              target="_blank"
            >
              <div className={f('hmmer-shape', 'yellow')} />
              <div className={f('hmmer-shape', 'red')} />
              <div className={f('hmmer-shape', 'blue')} />
              <span>Search selection with HMMER website</span>
            </Link>
          </div>
        </div>
        <br />
      </section>
    );
  }
}

export default Sequence;
