// @flow
import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
  convertToRaw,
} from 'draft-js';

import Redirect from 'components/generic/Redirect';

import { createJob, goToCustomLocation } from 'actions/creators';

import id from 'utils/cheapUniqueId';
import blockEvent from 'utils/blockEvent';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import local from './style.css';

import example from './example.fasta';

const f = foundationPartial(interproTheme, ipro, local);

const strategy = re => (block, cb) => {
  const text = block.getText();
  let match;
  while ((match = re.exec(text))) {
    cb(match.index, match.index + match[0].length);
  }
};

const classedSpan = className => {
  class Span extends PureComponent {
    static propTypes = {
      offsetKey: T.string.isRequired,
      children: T.any,
    };

    render() {
      const { offsetKey, children } = this.props;
      return (
        <span className={className} data-offset-key={offsetKey}>
          {children}
        </span>
      );
    }
  }

  return Span;
};

const checkValidity = (({ comment, IUPACProt }) => lines =>
  lines.reduce(
    (acc, line) => acc && (comment.test(line) || IUPACProt.test(line)),
    true,
  ))({ comment: /^\s*[>;].*$/m, IUPACProt: /^[a-z* -]*$/im });

const compositeDecorator = new CompositeDecorator([
  {
    strategy: strategy(/^\s*[>;].*$/gm),
    component: classedSpan(f('comment')),
  },
  {
    strategy: strategy(/[^a-z* -]+/gi),
    component: classedSpan(f('invalid-letter')),
  },
]);

class IPScanSearch extends Component {
  static propTypes = {
    createJob: T.func.isRequired,
    goToCustomLocation: T.func.isRequired,
    ipScan: T.object.isRequired,
    value: T.string,
  };

  constructor(props) {
    super(props);
    let editorState;
    if (props.value) {
      editorState = EditorState.createWithContent(
        ContentState.createFromText(decodeURIComponent(props.value)),
        compositeDecorator,
      );
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    this.state = {
      editorState,
      valid: true,
    };
  }

  _handleReset = text =>
    this.setState(
      {
        editorState:
          text && typeof text === 'string'
            ? EditorState.createWithContent(
                ContentState.createFromText(text),
                compositeDecorator,
              )
            : EditorState.createEmpty(compositeDecorator),
        valid: true,
        dragging: false,
        uploading: false,
      },
      () => this.editor.focus(),
    );

  _handleSubmit = async event => {
    event.preventDefault();
    const lines = convertToRaw(
      this.state.editorState.getCurrentContent(),
    ).blocks.map(block => block.text);
    if (!lines.length) return;
    const value = lines.join('\n');
    const localID = id(`internal-${Date.now()}`);
    this.props.createJob({
      metadata: {
        localID,
        type: 'InterProScan',
      },
      data: {
        input: value,
      },
    });
    this.props.goToCustomLocation({
      description: {
        main: { key: 'job' },
        job: { type: 'InterProScan' /*, accession: localID */ },
      },
    });
  };

  _handleFile = file => {
    const fr = new FileReader();
    fr.onload = () => {
      this._handleReset(fr.result);
    };
    fr.readAsText(file);
  };

  _loadExample = () => this._handleReset(example);

  _cleanUp = () =>
    this._handleReset(
      convertToRaw(this.state.editorState.getCurrentContent())
        .blocks.map(({ text }) => {
          const line = text.trim();
          if (!line) return null;
          if (/^[;>]/.test(line)) return line;
          return line.replace(/[^a-z* -]/gi, '').trim();
        })
        .filter(Boolean)
        .join('\n'),
    );

  _handleDroppedFiles = blockEvent(({ dataTransfer: { files: [file] } }) =>
    this._handleFile(file),
  );

  _handleDragging = blockEvent(() => this.setState({ dragging: true }));

  _handleUndragging = blockEvent(() => this.setState({ dragging: false }));

  _handleFileChange = ({ target }) => {
    this._handleFile(target.files[0]);
    // eslint-disable-next-line no-param-reassign
    target.value = null;
  };

  _handlePastedText = pasted => {
    const blockMap = ContentState.createFromText(pasted).getBlockMap();
    const editorState = EditorState.push(
      this.state.editorState,
      Modifier.replaceWithFragment(
        this.state.editorState.getCurrentContent(),
        this.state.editorState.getSelection(),
        blockMap,
      ),
      'insert-fragment',
    );
    this._handleChange(editorState);
    return true;
  };

  _handleEditorClick = () => this.editor.focus();

  _handleChange = editorState => {
    const lines = convertToRaw(editorState.getCurrentContent()).blocks.map(
      block => block.text,
    );
    this.setState({
      editorState,
      valid: checkValidity(lines),
    });
  };

  render() {
    // If we had a value, we used it in the constructor
    // But we don't want to have it in the url, so remove the value from it.
    if (this.props.value)
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'search' },
              search: { type: 'sequence' },
            },
          }}
        />
      );
    const { editorState, valid, dragging } = this.state;
    return (
      <div className={f('row', 'margin-bottom-medium')}>
        <div className={f('large-12', 'columns')}>
          <form
            onSubmit={this._handleSubmit}
            onDrop={this._handleDroppedFiles}
            onDrag={this._handleDragging}
            onDragStart={this._handleDragging}
            onDragEnd={this._handleUndragging}
            onDragOver={this._handleDragging}
            onDragEnter={this._handleDragging}
            onDragExit={this._handleUndragging}
            onDragLeave={this._handleUndragging}
            className={f('search-form', { dragging })}
          >
            <div>
              <div
                className={f(
                  'secondary',
                  'callout',
                  'border',
                  'margin-bottom-none',
                )}
              >
                <div className={f('row')}>
                  <div className={f('large-12', 'columns', 'sqc-search-input')}>
                    <h3>Sequence, in FASTA format</h3>
                    <div
                      onClick={this._handleEditorClick}
                      onKeyPress={this._handleEditorClick}
                      role="presentation"
                    >
                      <div
                        type="text"
                        className={f('editor', {
                          'invalid-block': !valid,
                        })}
                      >
                        <Editor
                          placeholder="Enter your sequence"
                          editorState={editorState}
                          handleDroppedFiles={this._handleDroppedFiles}
                          onChange={this._handleChange}
                          handlePastedText={this._handlePastedText}
                          ref={editor => (this.editor = editor)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={f('row')}>
                  <div className={f('medium-8', 'columns')}>
                    <div
                      className={f(
                        'button-group',
                        'line-with-buttons',
                        'margin-bottom-none',
                      )}
                    >
                      <button className={f('hollow', 'button', 'tertiary')}>
                        <label className={f('file-input-label')}>
                          Choose file
                          <input
                            type="file"
                            onChange={this._handleFileChange}
                            hidden
                          />
                        </label>
                      </button>
                      <button
                        type="button"
                        className={f('hollow', 'button', 'secondary')}
                        onClick={this._loadExample}
                      >
                        Example protein sequence
                      </button>
                      <button
                        type="button"
                        className={f('button', 'alert', { hidden: valid })}
                        onClick={this._cleanUp}
                      >
                        Automatic FASTA clean up
                      </button>
                    </div>
                  </div>
                  <div
                    className={f(
                      'medium-4',
                      'columns',
                      'show-for-medium',
                      'search-adv',
                    )}
                  >
                    <span>Powered by InterProScan</span>
                  </div>
                </div>

                <div className={f('row')} style={{ marginTop: '1em' }}>
                  <div
                    className={f(
                      'large-12',
                      'columns',
                      'stacked-for-small',
                      'button-group',
                      'margin-bottom-none',
                    )}
                  >
                    <input
                      type="submit"
                      className={f('button', { disabled: !valid })}
                      disabled={!valid}
                      value="Search"
                    />
                    <input
                      type="button"
                      className={f('secondary', 'hollow', 'button')}
                      onClick={this._handleReset}
                      value="Clear"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={f('dragging-overlay')}>Drop your file here</div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ipScan,
  state => state.customLocation.description.search.value,
  (ipScan, value) => ({ ipScan, value }),
);

export default connect(mapStateToProps, {
  createJob,
  goToCustomLocation,
})(IPScanSearch);
