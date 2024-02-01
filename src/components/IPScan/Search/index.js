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
import { askNotificationPermission } from 'utils/browser-notifications';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import local from './style.css';

import example from './example.fasta';

const f = foundationPartial(interproTheme, ipro, local);

export const MAX_NUMBER_OF_SEQUENCES = 100;

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
const doesPreviousBlockHasContent = (block, contentState) => {
  const before = contentState.getBlockBefore(block.key);
  if (!before) return true;
  const trimmed = before.getText().trim();
  if (trimmed === '' || trimmed.startsWith(';'))
    return doesPreviousBlockHasContent(before, contentState);
  return !trimmed.startsWith('>');
};
const commentsStrategy =
  (re, forErrors = false) =>
  (block, cb, contentState) => {
    const text = block.getText();
    let match;
    while ((match = re.exec(text))) {
      const prevSequenceOK = doesPreviousBlockHasContent(block, contentState);
      if (!forErrors && (prevSequenceOK || text.trim().startsWith(';')))
        cb(match.index, match.index + match[0].length);
      if (forErrors && !prevSequenceOK)
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

const isXChecked = (x) => (form) => !!form.querySelector(checkedSelectorFor(x));

const isStayChecked = isXChecked('stay');

const headerRE = /^\s*>.*$/m;
const IUPACProtRE = /^[a-z\s]*$/im;

const trimSequenceLines = (lines) =>
  lines
    .map((l) => l.trim()) // trimming
    .map((l) => (l.startsWith(';') ? false : l)) // removing comments
    .filter(Boolean);

export const checkValidity = (lines) => {
  let numberOfSequences = 0;
  let gotContentYet = false;
  const trimmedLines = trimSequenceLines(lines);
  if (!headerRE.test(trimmedLines[0]) && !IUPACProtRE.test(trimmedLines[0]))
    return false;
  for (const line of trimmedLines) {
    if (headerRE.test(line)) {
      if (numberOfSequences > 0 && !gotContentYet) return false;
      gotContentYet = false;
      numberOfSequences++;
    } else if (IUPACProtRE.test(line)) {
      gotContentYet = true;
    } else {
      return false;
    }
  }
  return numberOfSequences <= MAX_NUMBER_OF_SEQUENCES && gotContentYet;
};

const MIN_LENGTH = 3;

export const isTooShort = (lines) => {
  let count = 0;
  let firstLine = true;
  const trimmedLines = trimSequenceLines(lines);
  for (const line of trimmedLines) {
    if (headerRE.test(line)) {
      if (!firstLine && count < MIN_LENGTH) return true;
      count = 0;
    } else {
      count += line.trim().length;
    }
    firstLine = false;
  }
  return count < MIN_LENGTH;
};

const hasHeaderIssues = (lines) => {
  const trimmedLines = trimSequenceLines(lines);
  const isFirstLineAComment =
    trimmedLines.length && trimmedLines[0].startsWith('>');
  const numberOfHeaders = trimmedLines.filter((l) => l.startsWith('>')).length;
  if (numberOfHeaders === 0) return false;
  if (numberOfHeaders === 1 && isFirstLineAComment) return false;
  for (let x = 1; x < lines.length; x++) {
    if (lines[x - 1].startsWith('>') && lines[x].startsWith('>')) return true; // it has 2 consecutive headers
  }
  return false;
};
const hasTooManySequences = (lines) => {
  const trimmedLines = trimSequenceLines(lines);
  return (
    trimmedLines.filter((line) => line.startsWith('>')).length >
    MAX_NUMBER_OF_SEQUENCES
  );
};
const compositeDecorator = new CompositeDecorator([
  {
    strategy: commentsStrategy(/^\s*[>;].*$/gm),
    component: classedSpan(f('comment')),
  },
  {
    strategy: commentsStrategy(/^\s*[>].*$/gm, true),
    component: classedSpan(f('invalid-comment')),
  },
  {
    strategy: strategy(/[^a-z]+/gi),
    component: classedSpan(f('invalid-letter')),
  },
]);
const hasContentInNextLine = (lines, i) => {
  if (i + 1 >= lines.length) return false;
  const line = lines[i + 1].text.trim();
  if (line.startsWith(';') || line === '')
    return hasContentInNextLine(lines, i + 1);
  if (line.startsWith('>')) return false;
  return true;
};
export const cleanUp = (blocks) => {
  return blocks
    .map(({ text }, i, lines) => {
      const line = text.trim();
      if (!line) return null;
      if (line.startsWith(';')) return line;
      if (line.startsWith('>'))
        return hasContentInNextLine(lines, i) ? line : null;

      return line.replace(/[^a-z\s]/gi, '').trim();
    })
    .filter(Boolean)
    .join('\n');
};

const InfoMessages = ({ valid, tooShort, tooMany, headerIssues }) => {
  return (
    <div className={f('text-right')}>
      {!valid && (
        <div>
          {tooShort
            ? 'There is a header without content. '
            : 'The sequence has invalid characters. '}
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
      {tooMany && (
        <div>
          There are too many sequences. The maximum allowed is{' '}
          {MAX_NUMBER_OF_SEQUENCES}.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {headerIssues && (
        <div>
          There are issues with the headers.{' '}
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
  tooMany: T.bool.isRequired,
  headerIssues: T.bool.isRequired,
};
/*:: type Props = {
  createJob: function,
  goToCustomLocation: function,
  ipScan: Object,
  value: string,
  main: string,
  search: Object,

}*/

/*:: type State = {
  editorState: Object,
  valid: boolean,
  tooShort: boolean,
  tooMany: boolean,
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
    search: T.object,
  };

  constructor(props /*: Props */) {
    super(props);

    let editorState;
    let valid = true;
    let tooShort = true;
    let tooMany = false;
    let headerIssues = false;
    let initialAdvancedOptions = null;
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
      tooMany = hasTooManySequences(lines);
      headerIssues = hasHeaderIssues(lines);
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    if (props.search) {
      initialAdvancedOptions = props.search;
    }
    this.state = {
      editorState,
      valid,
      tooShort,
      tooMany,
      headerIssues,
      title: null,
      initialAdvancedOptions,
      submittedJob: null,
    };

    this._formRef = React.createRef();
    this._editorRef = React.createRef();
  }

  _getTitle = (lines) => {
    if (lines.length) {
      if (lines[0].startsWith('>')) {
        return lines[0].split('>')[1];
      }
    }
    return null;
  };

  _changeTitle = () => {
    const newTitle = this._formRef.current
      .querySelector('input[name="local-title"]')
      .value.trim();
    this.setState({
      title: newTitle,
    });
  };

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

    // let fileTitle = '';
    // if (typeof text === 'string') {
    // const lines = text.split(/\n/);
    // fileTitle = this._getTitle(lines);
    // }

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
        tooMany: false,
        headerIssues: false,
        dragging: false,
        uploading: false,
        title: null,
        submittedJob: null,
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
    const localID = id(`internal-${Date.now()}`);
    this.props.createJob({
      metadata: {
        localID,
        group: this.state.title,
        type: 'InterProScan',
      },
      data: {
        input: lines.join('\n'),
        applications: getCheckedApplications(this._formRef.current),
      },
    });
    // Request browser notification
    askNotificationPermission();

    if (isStayChecked(this._formRef.current)) {
      this._handleReset();
      this.setState({ submittedJob: localID });
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
      this.setState({
        title: file.name,
      });
    };
    fr.readAsText(file);
  };

  _loadExample = () => this._handleReset(example);

  _cleanUp = () =>
    this._handleReset(
      cleanUp(convertToRaw(this.state.editorState.getCurrentContent()).blocks),
    );

  _handleDroppedFiles = blockEvent(
    ({
      dataTransfer: {
        files: [file],
      },
    }) => this._handleFile(file),
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
    const minLengthForHeader = 3;
    const currentContent = editorState.getCurrentContent();
    if (currentContent.hasText()) {
      const firstLine = (lines?.[0] || '').trim();
      const hasHeader = firstLine.startsWith('>');
      if (!hasHeader && firstLine.length > minLengthForHeader) {
        const newHeader = `Sequence title ${getId()}`;
        const header = `> ${newHeader}`;
        // this.setState({ title: newHeader });
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
      tooMany: hasTooManySequences(lines),
      headerIssues: hasHeaderIssues(lines),
      // title: this._getTitle(lines),
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
    const { editorState, valid, tooShort, tooMany, headerIssues, dragging } =
      this.state;
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
                  'ipscan-block',
                )}
              >
                <div className={f('row')}>
                  <div className={f('large-12', 'columns', 'search-input')}>
                    {this.props.main === 'search' &&
                      this.state.submittedJob && (
                        <div className={f('callout')}>
                          Your search job(
                          <span className={f('mono')}>
                            {this.state.submittedJob}
                          </span>
                          ) has been submitted. You can check its state in the{' '}
                          <Link
                            to={{
                              description: {
                                main: { key: 'result' },
                                result: { type: 'InterProScan' },
                              },
                            }}
                          >
                            Results page
                          </Link>
                        </div>
                      )}
                    <h3 className={f('light')}>Sequence search</h3>
                    <SchemaOrgData
                      data={{
                        name: 'Search By Sequence',
                        description:
                          'Search for InterPro matches in your sequences',
                      }}
                      processData={schemaProcessDataPageSection}
                    />
                    {this.props.main === 'search' && (
                      <div className={f('description')}>
                        <Helmet>
                          <title>InterProScan</title>
                        </Helmet>
                        <p>
                          This form enables you to submit sequences to the
                          InterProScan web service for scanning against the
                          InterPro protein signature databases.
                          <br />
                          Please note that you can submit up to{' '}
                          {MAX_NUMBER_OF_SEQUENCES} sequences at a time.
                          Alternatively, you can{' '}
                          <Link
                            to={{
                              description: { other: ['about', 'interproscan'] },
                            }}
                          >
                            download InterProScan
                          </Link>{' '}
                          to scan your sequences locally.
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
                          'invalid-block':
                            !valid && editorState.getCurrentContent().hasText(),
                          'valid-block':
                            valid &&
                            editorState.getCurrentContent().hasText() &&
                            !tooShort &&
                            !headerIssues,
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
                    {editorState.getCurrentContent().hasText() && (
                      <InfoMessages
                        valid={valid}
                        tooShort={tooShort}
                        headerIssues={headerIssues}
                        tooMany={tooMany}
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
                        className={f('button', 'alert', {
                          hidden:
                            valid || !editorState.getCurrentContent().hasText(),
                        })}
                        onClick={this._cleanUp}
                      >
                        Automatic FASTA clean up
                      </button>
                    </div>
                  </div>
                </div>

                <AdvancedOptions
                  title={this.state.title}
                  changeTitle={this._changeTitle}
                  initialOptions={this.state.initialAdvancedOptions}
                />

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
  (state) => state.customLocation.search,
  (ipScan, desc, search) => ({
    ipScan,
    value: desc.search.value,
    main: desc.main.key,
    search,
  }),
);

export default connect(mapStateToProps, {
  createJob,
  goToCustomLocation,
})(IPScanSearch);
