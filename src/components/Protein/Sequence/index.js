// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro, local);

const comment = /^\s*[;>].*$/gm;
const whiteSpaces = /\s*/g;
const chunkOfTen = /.{1,10}/g;
const chunkOfEighty = /(.{1,80})/g;
const CHUNK_SIZE = 10;
/*:: type InnerProps = {
  sequence: string,
}; */

class Inner extends PureComponent /*:: <InnerProps> */ {
  static propTypes = {
    sequence: T.string.isRequired,
  };

  render() {
    const sequenceWords =
      this.props.sequence
        .replace(comment, '')
        .replace(whiteSpaces, '')
        .match(chunkOfTen) || [];
    return (
      <div className={f('raw-sequence-viewer', 'row')}>
        {sequenceWords.map((e, i) => (
          <span
            key={i}
            className={f('sequence_word')}
            style={{ zIndex: -i }}
            data-index={i}
          >
            {e}
          </span>
        ))}
      </div>
    );
  }
}

/*:: type SequenceProps = {
  sequence: string,
  goToCustomLocation: function,
  accession: string,
  name: ?string,
}; */

class Sequence extends PureComponent /*:: <SequenceProps> */ {
  /*:: _node: ?HTMLElement; */
  static propTypes = {
    sequence: T.string,
    goToCustomLocation: T.func.isRequired,
    accession: T.string.isRequired,
    name: T.string,
  };

  _isSelectionInSequence = selection => {
    if (!this._node) return false;
    // Beginning of selection is in the sequence element
    const selectionIsInSequence = this._node.contains(selection.anchorNode);
    if (!this._node) return false;
    // End of selection is in the sequence element
    return selectionIsInSequence && this._node.contains(selection.focusNode);
  };

  _getSelection = () => {
    let sequenceToSearch = this.props.sequence;
    let start = 1;
    let end = sequenceToSearch.length;
    if ('getSelection' in window) {
      const selection = window.getSelection();
      if (this._isSelectionInSequence(selection)) {
        // Get the text in the selection
        const selectionString = selection.toString().trim();
        if (selectionString) {
          sequenceToSearch = selectionString;
        }
        // define start and end value of sequence selection
        start =
          +selection.anchorNode.parentElement.dataset.index * CHUNK_SIZE +
          selection.anchorOffset +
          1;
        end = sequenceToSearch.length + start - 1;
      }
    }
    // Split by line of 80 characters
    sequenceToSearch = sequenceToSearch.replace(chunkOfEighty, '$1\n');
    // Prepend metainformation
    const meta = `>${
      this.props.accession
    } mol:protein subsequence:${start}-${end} length:${end - start + 1} ${this
      .props.name || ''}`.trim();
    return encodeURIComponent(`${meta}\n${sequenceToSearch}`);
  };

  _handleIPSClick = event => {
    event.preventDefault();
    this.props.goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: { type: 'sequence', value: this._getSelection() },
      },
    });
  };

  _handleHmmerClick = event => {
    const { currentTarget } = event;
    const oldHref = currentTarget.href;
    // Add the sequence as querystring to Hmmer link href
    currentTarget.href += `?seq=${this._getSelection()}`;
    // Reset href, but after the click was done
    setTimeout(() => (currentTarget.href = oldHref));
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
            className={f('medium-10', 'columns', 'margin-bottom-large')}
            ref={node => (this._node = node)}
          >
            <Inner sequence={sequence} />
          </div>
          <div className={f('medium-2', 'columns')}>
            <Link
              className={f('button', 'primary', 'sequence-link')}
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'sequence' },
                },
              }}
              onClick={this._handleIPSClick}
            >
              <div className={f('shape', 'ips', 'gray')} />
              <div className={f('shape', 'ips', 'green')} />
              <div className={f('shape', 'ips', 'pale-green')} />
              <div className={f('shape', 'ips', 'red')} />
              <div className={f('shape', 'ips', 'blue')} />
              <span>Search selection with InterProScan</span>
            </Link>
            <Link
              className={f('button', 'hollow', 'primary', 'sequence-link')}
              href="https://www.ebi.ac.uk/Tools/hmmer/search/phmmer"
              onClick={this._handleHmmerClick}
              target="_blank"
            >
              <div className={f('shape', 'hmmer', 'yellow')} />
              <div className={f('shape', 'hmmer', 'red')} />
              <div className={f('shape', 'hmmer', 'blue')} />
              <span>Search selection with HMMER website</span>
            </Link>
          </div>
        </div>
        <br />
      </section>
    );
  }
}

export default connect(undefined, { goToCustomLocation })(Sequence);
