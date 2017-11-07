import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Modifier,
  convertToRaw,
} from 'draft-js';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import url from 'url';

import config from 'config';
import { addToast } from 'actions/creators';

import id from 'utils/cheapUniqueId';
import blockEvent from 'utils/blockEvent';

import getTableAccess from 'storage/idb';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import f from './style.css';

import example from './example.fasta';

const s = foundationPartial(interproTheme, ipro, f);

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
    component: classedSpan(s('comment')),
  },
  {
    strategy: strategy(/[^a-z* -]+/gi),
    component: classedSpan(s('invalid-letter')),
  },
]);

class IPScanSearch extends Component {
  static propTypes = {
    addToast: T.func.isRequired,
    value: T.string,
    ipScan: T.object.isRequired,
    sequence: T.string,
  };

  constructor(props) {
    super(props);
    let editorState;
    if (props.sequence) {
      editorState = EditorState.createWithContent(
        ContentState.createFromText(props.sequence),
        compositeDecorator,
      );
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    this.state = {
      editorState,
      valid: true,
    };
    this._jobsTA = getTableAccess('interproscan-jobs');
    this._blobsTA = getTableAccess('blobs');
  }

  _storeJob = async (job, jobId) => {
    const jobsTA = await this._jobsTA;
    return jobsTA.set(job, jobId);
  };

  _createAndStoreJob = async ({ value }) => {
    const blobsTA = await this._blobsTA;
    const now = Date.now();
    // Stores the sequence
    const blobId = await blobsTA.set({
      value,
      created: now,
      saved: false,
    });
    // job object
    const job = {
      input: {
        sequenceBlobId: blobId,
      },
      times: {
        created: now,
        lastUpdate: now,
      },
      status: 'created',
    };
    let jobId;
    try {
      // Stores the job
      jobId = await this._storeJob(job);
    } catch (err) {
      // If job storage errors, remove sequence from storage
      await blobsTA.delete(blobId);
      throw err;
    }
    return { jobId, job };
  };

  _submitSearch = async ({ value }) => {
    const body = new FormData();
    body.set('email', config.IPScan.contactEmail);
    body.set('sequence', value);
    const r = await fetch(
      url.resolve(
        url.format({ ...this.props.ipScan, pathname: this.props.ipScan.root }),
        'run',
      ),
      { method: 'POST', body },
    );
    console.log(r);
    const text = await r.text();
    if (!r.ok) throw new Error(text);
    console.log(text);
    return text;
  };

  _storeSubmittedJob = async ({ jobId, job }) => {
    const jobsTA = await this._jobsTA;
    // eslint-disable-next-line no-param-reassign
    job.times.submitted = job.times.lastUpdate = Date.now();
    // eslint-disable-next-line no-param-reassign
    job.status = 'running';
    return jobsTA.set(job, jobId);
  };

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
      },
      () => this.editor.focus(),
    );

  _handleSubmitFail = err => {
    // An error happened during job submission
    console.error(err);
    // Focuses back to the editor to modify the sequence
    this.editor.focus();
    // Displays message and bails
    this.props.addToast(
      {
        title: 'Job submission failed',
        body: 'Something wrong happened while trying to submit your job',
        className: s('alert'),
        ttl: 5000,
      },
      id(),
    );
  };

  _handleSubmitSuccess = ({ job, jobId }) => {
    // If job successfully submitted, resets input field
    this._handleReset();
    // Stores the job
    this._storeSubmittedJob({ job, jobId });
    // And notifies user
    this.props.addToast(
      {
        title: 'Job submitted',
        body: `Your job has been successfully submitted with an id of ${job.id}`,
        className: s('success'),
        ttl: 5000,
      },
      id(),
    );
  };

  _handleSubmit = async event => {
    event.preventDefault();
    const lines = convertToRaw(
      this.state.editorState.getCurrentContent(),
    ).blocks.map(block => block.text);
    if (!lines.length) return;
    const value = lines.join('\n');
    // console.log(`POSTing ${value}`);
    let jobAndJobId;
    let IPScanId;
    try {
      [jobAndJobId, IPScanId] = await Promise.all([
        this._createAndStoreJob({ value }),
        this._submitSearch({ value }),
      ]);
    } catch (err) {
      return this._handleSubmitFail(err);
    }
    console.log({ jobAndJobId, IPScanId });
    jobAndJobId.job.id = IPScanId;
    this._handleSubmitSuccess(jobAndJobId);
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
    const { editorState, valid, dragging } = this.state;
    return (
      <div className={s('row')}>
        <div className={s('large-12', 'columns')}>
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
            className={s('search-form', { dragging })}
          >
            <div>
              <div className={s('secondary', 'callout')}>
                <div className={s('row')}>
                  <div className={s('large-12', 'columns')}>
                    <label
                      onClick={this._handleEditorClick}
                      onKeyPress={this._handleEditorClick}
                      role="presentation"
                    >
                      Sequence, in FASTA format
                      <div
                        type="text"
                        className={s('editor', { 'invalid-block': !valid })}
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
                    </label>
                    <div className={s('button-group', 'line-with-buttons')}>
                      <button className={s('hollow', 'button', 'tertiary')}>
                        <label className={s('file-input-label')}>
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
                        className={s('hollow', 'button', 'secondary')}
                        onClick={this._loadExample}
                      >
                        Example protein sequence
                      </button>
                      <button
                        type="button"
                        className={s('hollow', 'button', 'warning', {
                          hidden: valid,
                        })}
                        onClick={this._cleanUp}
                      >
                        Automatic input clean up
                      </button>
                    </div>
                  </div>
                </div>

                <div className={s('row')} style={{ marginTop: '1em' }}>
                  <div
                    className={s(
                      'large-12',
                      'columns',
                      'stacked-for-small',
                      'button-group',
                    )}
                  >
                    <input
                      type="submit"
                      className={s('button', { disabled: !valid })}
                      disabled={!valid}
                      value="Search"
                    />
                    <input
                      type="button"
                      className={s('secondary', 'hollow', 'button')}
                      onClick={this._handleReset}
                      value="Clear"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={s('dragging-overlay')}>Drop your file here</div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ipScan,
  state => state.newLocation.search.sequence,
  (ipScan, sequence) => ({ ipScan, sequence }),
);

export default connect(mapStateToProps, { addToast })(IPScanSearch);
