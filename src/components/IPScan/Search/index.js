import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
  convertToRaw,
} from 'draft-js';

import AdvancedOptions from 'components/IPScan/AdvancedOptions';
import Redirect from 'components/generic/Redirect';
import Link from 'components/generic/Link';
import getId from 'utils/cheap-unique-id';

import { createJob, goToCustomLocation } from 'actions/creators';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import id from 'utils/cheap-unique-id';
import blockEvent from 'utils/block-event';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import local from './style.css';

import example from './example.fasta';

const f = foundationPartial(interproTheme, ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const strategy = (re) => (block, cb) => {
  const text = block.getText();
  let match;
  while ((match = re.exec(text))) {
    cb(match.index, match.index + match[0].length);
  }
};
const isFirstBlockWithContent = (block, contentState) => {
  const before = contentState.getBlockBefore(block.key);
  if (!before) return true;
  if (before.getText().trim() === '')
    return isFirstBlockWithContent(before, contentState);
  return false;
};
const commentsStrategy = (re, forErrors = false) => (
  block,
  cb,
  contentState,
) => {
  const text = block.getText();
  let match;
  while ((match = re.exec(text))) {
    const isFirstComment = isFirstBlockWithContent(block, contentState);
    if (!forErrors && isFirstComment)
      cb(match.index, match.index + match[0].length);
    if (forErrors && !isFirstComment)
      cb(match.index, match.index + match[0].length);
  }
};
/*:: type ScanProps = {
      offsetKey: string,
      children: any
  }*/
const classedSpan = (className) => {
  class Span extends PureComponent /*:: <ScanProps> */ {
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

const checkedSelectorFor = (x) => `input[name="${x}"]:checked`;

const getCheckedApplications = (form) =>
  Array.from(
    form.querySelectorAll(checkedSelectorFor('appl')),
    (input) => input.value,
  );

const getLocalTitle = (form) =>
  form.querySelector('input[name="local-title"]').value.trim();

const isXChecked = (x) => (form) => !!form.querySelector(checkedSelectorFor(x));

const isStayChecked = isXChecked('stay');

const commentRE = /^\s*[>;].*$/m;
const IUPACProtRE = /^[a-z\s]*$/im;

export const checkValidity = (lines) => {
  const trimmedLines = lines.map((l) => l.trim()).filter(Boolean);
  if (!commentRE.test(trimmedLines[0]) && !IUPACProtRE.test(trimmedLines[0]))
    return false;
  for (const line of trimmedLines.slice(1)) {
    if (!IUPACProtRE.test(line)) return false;
  }
  return true;
};

const MIN_LENGTH = 3;

export const isTooShort = (lines) => {
  let count = 0;
  for (const line of lines) {
    if (IUPACProtRE.test(line)) count += line.trim().length;
    if (count >= MIN_LENGTH) return false;
  }
  return true;
};

const hasHeaderIssues = (lines) => {
  const trimmedLines = lines.map((l) => l.trim()).filter(Boolean);
  const isFirstLineAComment =
    trimmedLines.length && trimmedLines[0].startsWith('>');
  const numberOfComments = trimmedLines.filter((l) => l.startsWith('>')).length;
  if (numberOfComments === 0) return false;
  if (numberOfComments === 1 && isFirstLineAComment) return false;
  return true;
};
const compositeDecorator = new CompositeDecorator([
  {
    strategy: commentsStrategy(/^\s*[>;].*$/gm),
    component: classedSpan(f('comment')),
  },
  {
    strategy: commentsStrategy(/^\s*[>;].*$/gm, true),
    component: classedSpan(f('invalid-comment')),
  },
  {
    strategy: strategy(/[^a-z]+/gi),
    component: classedSpan(f('invalid-letter')),
  },
]);

export const cleanUp = (blocks) => {
  let endOfFirstSequence = false;
  return blocks
    .map(({ text }, i, lines) => {
      const line = text.trim();
      if (!line || endOfFirstSequence) return null;
      const firstComment = lines.findIndex(({ text: l }) =>
        l.trim().startsWith('>'),
      );
      if (line.startsWith('>') && firstComment !== i) {
        endOfFirstSequence = true;
        return null;
      }
      if (/^[;>]/.test(line)) return line;
      return line.replace(/[^a-z\s]/gi, '').trim();
    })
    .filter(Boolean)
    .join('\n');
};

const InfoMessages = ({ valid, tooShort, headerIssues }) => {
  return (
    <div className={f('text-right')}>
      {!valid && (
        <div>
          The sequence has invalid characters.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {valid && tooShort && (
        <div>
          The sequence is too short.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {headerIssues && (
        <div>
          There are issues with the header of the sequence.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {valid && !tooShort && !headerIssues && (
        <div>
          Valid Sequence.{' '}
          <span role="img" aria-label="warning">
            ✅
          </span>
        </div>
      )}
    </div>
  );
};
InfoMessages.propTypes = {
  valid: T.bool.isRequired,
  tooShort: T.bool.isRequired,
  headerIssues: T.bool.isRequired,
};
/*:: type Props = {
  createJob: function,
  goToCustomLocation: function,
  ipScan: Object,
  value: string,
  main: string,
}*/

/*:: type State = {
  editorState: Object,
  valid: boolean,
  tooShort: boolean,
}*/

export class IPScanSearch extends PureComponent /*:: <Props, State> */ {
  /*::
    _formRef: { current: null | React$ElementRef<'form'> };
    _editorRef: { current: null | React$ElementRef<'editor'> };
  */
  static propTypes = {
    createJob: T.func.isRequired,
    goToCustomLocation: T.func.isRequired,
    ipScan: T.object.isRequired,
    value: T.string,
    main: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    let editorState;
    let valid = true;
    let tooShort = true;
    let headerIssues = false;
    if (props.value) {
      editorState = EditorState.createWithContent(
        ContentState.createFromText(decodeURIComponent(props.value)),
        compositeDecorator,
      );
      const lines = convertToRaw(editorState.getCurrentContent()).blocks.map(
        (block) => block.text,
      );
      valid = checkValidity(lines);
      tooShort = isTooShort(lines);
      headerIssues = hasHeaderIssues(lines);
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    this.state = {
      editorState,
      valid,
      tooShort,
      headerIssues,
    };

    this._formRef = React.createRef();
    this._editorRef = React.createRef();
  }

  _handleReset = (text) => {
    if (this._formRef.current && typeof text !== 'string') {
      const inputsToReset = Array.from(
        this._formRef.current.querySelectorAll(
          'input[name]:not([name="stay"])',
        ),
      );
      for (const input of inputsToReset) {
        input.checked = !!input.dataset.defaultchecked;
      }
    }
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
        tooShort: true,
        headerIssues: false,
        dragging: false,
        uploading: false,
      },
      this._focusEditor,
    );
  };

  _handleSubmit = (event) => {
    event.preventDefault();
    if (!this._formRef.current) return;
    const lines = convertToRaw(
      this.state.editorState.getCurrentContent(),
    ).blocks.map((block) => block.text);
    if (!lines.length) return;
    this.props.createJob({
      metadata: {
        localID: id(`internal-${Date.now()}`),
        localTitle: getLocalTitle(this._formRef.current) || null,
        type: 'InterProScan',
      },
      data: {
        input: lines.join('\n'),
        applications: getCheckedApplications(this._formRef.current),
        goterms: true,
        pathways: true,
      },
    });
    if (isStayChecked(this._formRef.current)) {
      this._handleReset();
    } else {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'result' },
          result: { type: 'InterProScan' /* , accession: localID */ },
        },
      });
    }
  };

  _handleFile = (file) => {
    const fr = new FileReader();
    fr.onload = () => {
      this._handleReset(fr.result);
    };
    fr.readAsText(file);
  };

  _loadExample = () => this._handleReset(example);

  _cleanUp = () =>
    this._handleReset(
      cleanUp(convertToRaw(this.state.editorState.getCurrentContent()).blocks),
    );

  _handleDroppedFiles = blockEvent(({ dataTransfer: { files: [file] } }) =>
    this._handleFile(file),
  );

  _handleDragging = blockEvent(() => this.setState({ dragging: true }));

  _handleUndragging = blockEvent(() => this.setState({ dragging: false }));

  _handleFileChange = ({ target }) => {
    this._handleFile(target.files[0]);
    target.value = null;
  };

  _handlePastedText = (pasted) => {
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

  _focusEditor = () => {
    if (this._editorRef.current) this._editorRef.current.focus();
  };

  _addFastAHeaderIfNeeded = (editorState, lines) => {
    const currentContent = editorState.getCurrentContent();
    if (currentContent.hasText()) {
      const firstLine = (lines?.[0] || '').trim();
      const hasHeader = firstLine.startsWith('>') && firstLine.length > 1;
      if (!hasHeader) {
        const header = `> Sequence title ${getId()}`;
        lines.splice(0, 0, header);
        const newState = EditorState.createWithContent(
          ContentState.createFromText(lines.join('\n')),
          compositeDecorator,
        );
        return EditorState.moveFocusToEnd(newState);
      }
    }
    return null;
  };

  _handleChange = (editorState) => {
    const lines = convertToRaw(editorState.getCurrentContent()).blocks.map(
      (block) => block.text,
    );
    const stateWithHeader = this._addFastAHeaderIfNeeded(editorState, lines);
    if (stateWithHeader) {
      this._handleChange(stateWithHeader);
      return;
    }
    this.setState({
      editorState,
      valid: checkValidity(lines),
      tooShort: isTooShort(lines),
      headerIssues: hasHeaderIssues(lines),
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
    const { editorState, valid, tooShort, headerIssues, dragging } = this.state;
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
            ref={this._formRef}
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
                  <div className={f('large-12', 'columns', 'search-input')}>
                    <h3 className={f('light')}>Sequence, in FASTA format</h3>
                    <SchemaOrgData
                      data={{
                        name: 'Search By Sequence',
                        description:
                          'Search for InterPro matches in your seqeunce',
                      }}
                      processData={schemaProcessDataPageSection}
                    />
                    {this.props.main === 'search' && (
                      <div className={f('description')}>
                        <Helmet>
                          <title>InterProScan</title>
                        </Helmet>
                        <p>
                          This form allows you to scan your sequence for matches
                          against the InterPro protein signature databases,
                          using InterProScan tool. Enter or paste a protein
                          sequence in FASTA format (complete or not - e.g.{' '}
                          <span className={f('sequence')}>
                            PMPIGSKERPTFFEIFKTRCNKADLGPISLN
                          </span>
                          ), with a maximum length of 40,000 amino acids.
                        </p>
                        <p>
                          Please note that you can only scan one sequence at a
                          time. Alternatively, read{' '}
                          <Link
                            to={{
                              description: { other: ['about', 'interproscan'] },
                            }}
                          >
                            more about InterProScan
                          </Link>{' '}
                          for other ways of running sequences through
                          InterProScan.
                        </p>
                      </div>
                    )}
                    <div
                      onClick={this._focusEditor}
                      onKeyPress={this._focusEditor}
                      role="presentation"
                    >
                      <div
                        type="text"
                        className={f('editor', {
                          'invalid-block': !valid,
                          'valid-block': valid && !tooShort && !headerIssues,
                        })}
                      >
                        <Editor
                          placeholder="Enter your sequence"
                          editorState={editorState}
                          handleDroppedFiles={this._handleDroppedFiles}
                          onChange={this._handleChange}
                          handlePastedText={this._handlePastedText}
                          ref={this._editorRef}
                        />
                      </div>
                    </div>
                    {editorState.getCurrentContent().getPlainText().length >
                      0 && (
                      <InfoMessages
                        valid={valid}
                        tooShort={tooShort}
                        headerIssues={headerIssues}
                      />
                    )}
                  </div>
                </div>

                <div className={f('row')}>
                  <div className={f('columns')}>
                    <div className={f('button-group', 'line-with-buttons')}>
                      <label
                        className={f(
                          'hollow',
                          'button',
                          'tertiary',
                          'user-select-none',
                        )}
                      >
                        Choose file
                        <input
                          type="file"
                          onChange={this._handleFileChange}
                          hidden
                        />
                      </label>
                      <button
                        type="button"
                        className={f(
                          'hollow',
                          'button',
                          'secondary',
                          'user-select-none',
                        )}
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
                </div>

                <AdvancedOptions />

                <div className={f('row')}>
                  <div
                    className={f(
                      'large-8',
                      'columns',
                      'stacked-for-small',
                      'button-group',
                      'margin-bottom-none',
                    )}
                  >
                    <input
                      type="submit"
                      className={f('button', { disabled: !valid })}
                      disabled={tooShort || !valid}
                      value="Search"
                    />
                    <input
                      type="button"
                      className={f('secondary', 'hollow', 'button')}
                      onClick={this._handleReset}
                      value="Clear"
                    />
                  </div>
                  <div
                    className={f(
                      'large-4',
                      'columns',
                      'show-for-medium',
                      'search-adv',
                    )}
                  >
                    <span>Powered by InterProScan</span>
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
  (state) => state.settings.ipScan,
  (state) => state.customLocation.description,
  (ipScan, desc) => ({ ipScan, value: desc.search.value, main: desc.main.key }),
);

export default connect(mapStateToProps, {
  createJob,
  goToCustomLocation,
})(IPScanSearch);
