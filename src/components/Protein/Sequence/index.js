// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import HmmerButton from 'components/Protein/Sequence/HmmerButton';

import local from './style.css';
import ipro from 'styles/interpro-new.css';
import loadable from 'higherOrder/loadable';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro, local);

const comment = /^\s*[;>].*$/gm;
const whiteSpaces = /\s*/g;
const chunkOfTen = /.{1,10}/g;
const chunkOfEighty = /(.{1,80})/g;
const CHUNK_SIZE = 10;

/*:: type InnerProps = {
  sequence: string,
}; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const schemaProcessData = (length /*: number */) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  additionalType: 'hhttp://semanticscience.org/resource/SIO_000205',
  name: 'protein sequence',
  value: {
    '@type': 'StructuredValue',
    additionalType: [
      'bio:BioChemEntity',
      'http://semanticscience.org/resource/SIO_010015',
    ],
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'length',
      value: length,
    },
  },
});

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
        <SchemaOrgData
          data={this.props.sequence.length}
          processData={schemaProcessData}
        />
        {sequenceWords.map((e, i) => (
          <React.Fragment key={i}>
            <span
              className={f('sequence_word')}
              style={{ zIndex: -i, display: 'inline-block' }}
              data-index={i}
            >
              {e}
            </span>
            <div className={f('sequence_word_spacer')} />
          </React.Fragment>
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
  customLocation: Object,
}; */

export class Sequence extends PureComponent /*:: <SequenceProps> */ {
  /*:: _ref: { current: null | React$ElementRef<'div'> }; */

  static propTypes = {
    sequence: T.string,
    goToCustomLocation: T.func.isRequired,
    accession: T.string.isRequired,
    customLocation: T.object,
    name: T.string,
  };

  constructor(props /*: SequenceProps */) {
    super(props);

    this._ref = React.createRef();
  }
  componentDidMount() {
    document.addEventListener('selectionchange', this._goToSelection);
    this._selectFromHash();
  }
  componentDidUpdate() {
    this._selectFromHash();
  }
  componentWillUnmount() {
    document.removeEventListener('selectionchange', this._goToSelection);
  }

  _goToSelection = () => {
    const { start, end } = this._getSelectionRange();
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      hash: `${start}-${end}`,
    });
  };
  _getPositionFromHash = (hash) => {
    const re = /^(\d)+-(\d)+$/;
    if (re.test(hash)) {
      const [start, end] = hash.split('-').map(Number);
      if (start < end) {
        return { start, end };
      }
    }
    return null;
  };
  _selectFromHash = () => {
    const hash = this.props.customLocation.hash;
    const { start: s, end: e } = this._getSelectionRange();
    if (hash !== `${s}-${e}`) {
      const position = this._getPositionFromHash(hash);
      if (!position) return null;
      const { start, end } = position;
      const range = document.createRange();
      const startNode = document.querySelector(
        `span[data-index='${Math.floor((start - 1) / CHUNK_SIZE)}']`,
      );
      const endNode = document.querySelector(
        `span[data-index='${Math.floor(end / CHUNK_SIZE)}']`,
      );
      if (startNode && endNode) {
        if (startNode.firstChild)
          range.setStart(startNode.firstChild, (start - 1) % CHUNK_SIZE);
        if (endNode.firstChild)
          range.setEnd(endNode.firstChild, end % CHUNK_SIZE);
        window.getSelection().empty();
        window.getSelection().addRange(range);
      }
    }
  };

  _isSelectionInSequence = (selection) => {
    if (!this._ref.current) return false;
    // Beginning of selection is in the sequence element
    const selectionIsInSequence = this._ref.current.contains(
      selection.anchorNode,
    );
    if (!this._ref.current) return false;
    // End of selection is in the sequence element
    return (
      selectionIsInSequence && this._ref.current.contains(selection.focusNode)
    );
  };
  _getSelectionRange = () => {
    let sequenceToSearch = this.props.sequence;
    let start = 1;
    let end = sequenceToSearch.length;
    if ('getSelection' in window) {
      const selection = window.getSelection();
      if (this._isSelectionInSequence(selection)) {
        // Get the text in the selection
        const selectionString = selection.toString().trim();
        if (selectionString) {
          sequenceToSearch = selectionString.replace(/\s/gi, '');
        } else {
          return { start, end };
        }
        // define start and end value of sequence selection
        start =
          +selection.anchorNode.parentElement.dataset.index * CHUNK_SIZE +
          selection.anchorOffset +
          1;
        end = sequenceToSearch.length + start - 1;
      }
    }
    return { start, end };
  };

  _getSelection = () => {
    let sequenceToSearch = this.props.sequence;
    const { start, end } = this._getSelectionRange();

    // Split by line of 80 characters
    sequenceToSearch = sequenceToSearch
      .slice(Math.max(0, start - 1), end)
      .replace(chunkOfEighty, '$1\n');
    // Prepend metainformation
    const meta = `>${
      this.props.accession
    } mol:protein subsequence:${start}-${end} length:${end - start + 1} ${
      this.props.name || ''
    }`.trim();
    return encodeURIComponent(`${meta}\n${sequenceToSearch}`);
  };

  _handleIPSClick = (event) => {
    event.preventDefault();
    this.props.goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: { type: 'sequence', value: this._getSelection() },
      },
    });
  };

  render() {
    const { sequence, accession, name } = this.props;
    const header = accession || name;
    return (
      <section id="sequence">
        <div className={f('row', 'columns')}>
          <h5>Sequence</h5>
        </div>

        <div className={f('row')}>
          <div
            className={f(
              'small-12',
              'medium-12',
              'large-8',
              'columns',
              'margin-bottom-large',
            )}
            ref={this._ref}
          >
            {header && (
              <div
                className={f(
                  'raw-sequence-viewer',
                  'row',
                  'raw-sequence-header',
                )}
              >
                {`> ${header}`}
              </div>
            )}
            <Inner sequence={sequence} />
          </div>
          <div className={f('small-12', 'medium-12', 'large-4', 'columns')}>
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'sequence' },
                },
              }}
              onClick={this._handleIPSClick}
            >
              <div
                className={f(
                  'sequence-link',
                  'button-more',
                  'icon',
                  'icon-common',
                  'icon-right',
                )}
                data-icon="&#xf061;"
                style={{ minWidth: '302px', marginRight: '1rem' }}
              >
                <div className={f('shape', 'ips', 'gray')} />
                <div className={f('shape', 'ips', 'green')} />
                <div className={f('shape', 'ips', 'pale-green')} />
                <div className={f('shape', 'ips', 'red')} />
                <div className={f('shape', 'ips', 'blue')} />
                <span>Search selection with InterProScan</span>
              </div>
            </Link>
            <HmmerButton sequence={this._getSelection} />
          </div>
        </div>
      </section>
    );
  }
}
const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(Sequence);
