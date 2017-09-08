// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';

import { goToNewLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import pStyles from './style.css';

const f = foundationPartial(pStyles);

const comment = /^\s*[;>].*$/gm;
const whiteSpaces = /\s*/g;
const chunkOfTen = /.{1,10}/g;

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
      <div className={f('sequence', 'row')}>
        {sequenceWords.map((e, i) => (
          <span key={i} className={f('sequence_word')} style={{ zIndex: -i }}>
            {e}
          </span>
        ))}
      </div>
    );
  }
}

/*:: type SequenceProps = {
  sequence: string,
  goToNewLocation: function,
}; */

class Sequence extends PureComponent /*:: <SequenceProps> */ {
  /*:: _node: ?HTMLElement; */
  static propTypes = {
    sequence: T.string,
    goToNewLocation: T.func.isRequired,
  };

  _getSelection = () => {
    let sequenceToSearch = this.props.sequence;
    if ('getSelection' in window) {
      const selection = window.getSelection();
      if (!this._node) return sequenceToSearch;
      // Beginning of selection is in the sequence element
      let selectionIsInSequence = this._node.contains(selection.anchorNode);
      if (!this._node) return sequenceToSearch;
      selectionIsInSequence =
        // End of selection is in the sequence element
        selectionIsInSequence && this._node.contains(selection.focusNode);
      if (selectionIsInSequence) {
        // Get the text in the selection
        const selectionString = selection.toString().trim();
        if (selectionString) {
          sequenceToSearch = selectionString;
        }
      }
    }
    return sequenceToSearch;
  };

  _handleIPSClick = event => {
    event.preventDefault();
    this.props.goToNewLocation({
      description: {
        mainType: 'search',
        mainDB: 'sequence',
      },
      search: {
        sequence: this._getSelection(),
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
            className={f('large-10', 'columns')}
            ref={node => (this._node = node)}
          >
            <Inner sequence={sequence} />
          </div>
          <div className={f('large-2', 'columns')}>
            <Link
              className={f('button', 'hollow', 'link', 'row')}
              newTo={{
                description: {
                  mainType: 'search',
                  mainDB: 'sequence',
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
              className={f('button', 'hollow', 'link', 'row')}
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

export default connect(undefined, { goToNewLocation })(Sequence);
