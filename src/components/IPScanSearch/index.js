import React, {PropTypes as T, Component} from 'react';
import {
  Editor, EditorState, ContentState, CompositeDecorator, convertToRaw,
} from 'draft-js';
import {withRouter} from 'react-router/es';
import {connect} from 'react-redux';

import {addToast} from 'actions/creators';

import id from 'utils/cheapUniqueId';
import blockEvent from 'utils/blockEvent';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
const s = foundationPartial(styles);

const strategy = re => (block, cb) => {
  const text = block.getText();
  let match;
  while ((match = re.exec(text))) {
    cb(match.index, match.index + match[0].length);
  }
};

const classedSpan = className => {
  const Span = ({offsetKey, children}) => (
    <span className={className} data-offset-key={offsetKey}>{children}</span>
  );
  Span.propTypes = {
    offsetKey: T.string.isRequired,
    children: T.any,
  };
  return Span;
};

const checkValidity = (({comment, IUPACProt}) => lines => (
  lines.reduce((acc, line) => (
    acc && (comment.test(line) || IUPACProt.test(line))
  ), true))
)({comment: /^\s*[>;].*$/m, IUPACProt: /^[a-z* -]*$/mi});

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

const submitSearch = async value => {
  const r = await fetch(
    'https://www.ebi.ac.uk/Tools/services/rest/iprscan5/run/',
    {
      method: 'POST',
      body: new FormData({
        email: 'example@example.com',
        sequence: value,
      }),
    }
  );
  console.log(r);
  const text = await r.text();
  console.log(text);
  return text;
};

class IPScanSearch extends Component {
  static propTypes = {
    addToast: T.func.isRequired,
    router: T.object,
    value: T.string,
    location: T.shape({
      query: T.object,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      valid: true,
    };
  }

  _handleReset = text => this.setState(
    {
      editorState: (text && typeof text === 'string') ?
        EditorState.createWithContent(
          ContentState.createFromText(text),
          compositeDecorator
        ) :
        EditorState.createEmpty(compositeDecorator),
      valid: true,
      dragging: false,
    },
    () => this.editor.focus()
  );

  _handleSubmitFail = err => {
    // An error happened during job submission
    console.error(err);
    // Focuses back to the editor to modify the sequence
    this.editor.focus();
    // Displays message and bails
    this.props.addToast({
      title: 'Job submission failed',
      body: 'Something wrong happened while trying to submit your job',
      className: s('alert'),
      ttl: 5000,
    }, id());
  };

  _handleSubmitSuccess = jobId => {
    // If job successfully submitted, resets input field
    this._handleReset();
    // And notifies user
    this.props.addToast({
      title: 'Job submitted',
      body: `Your job has been successfully submitted with an id of ${jobId}`,
      className: s('success'),
      ttl: 5000,
    }, id());
  };

  _handleSubmit = async event => {
    event.preventDefault();
    const lines = convertToRaw(
      this.state.editorState.getCurrentContent()
    ).blocks.map(block => block.text);
    if (!lines.length) return;
    const value = lines.join('\n');
    console.log(`POSTing ${value}`);
    let jobId;
    try {
      jobId = await submitSearch(value);
    } catch (err) {
      return this._handleSubmitFail(err);
    }
    this._handleSubmitSuccess(jobId);
  };

  _handleFile = file => {
    const fr = new FileReader();
    fr.onload = () => {
      this._handleReset(fr.result);
    };
    fr.readAsText(file);
  };

  _handleDroppedFiles = blockEvent(
    ({dataTransfer: {files: [file]}}) => this._handleFile(file)
  );

  _handleDragging = blockEvent(() => this.setState({dragging: true}));

  _handleUndragging = blockEvent(() => this.setState({dragging: false}));

  _handleFileChange = ({target}) => {
    this._handleFile(target.files[0]);
    // eslint-disable-next-line no-param-reassign
    target.value = null;
  };

  _handleEditorClick = () => this.editor.focus();

  _handleChange = editorState => {
    const lines = convertToRaw(editorState.getCurrentContent()).blocks
      .map(block => block.text);
    this.setState({
      editorState,
      valid: checkValidity(lines),
    });
  };

  render() {
    const {editorState, valid, dragging} = this.state;
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
            className={s('search-form', {dragging})}
          >
            <div>
              <div className={s('secondary', 'callout')}>
                <div className={s('row')}>
                  <div
                    className={s('large-12', 'columns')}
                  >
                    <label onClick={this._handleEditorClick}>
                      Sequence, in FASTA format
                      <div
                        type="text"
                        className={s('editor', {'invalid-block': !valid})}
                      >
                        <Editor
                          placeholder="Enter your sequence"
                          editorState={editorState}
                          handleDroppedFiles={this._handleDroppedFiles}
                          onChange={this._handleChange}
                          ref={editor => this.editor = editor}
                        />
                      </div>
                    </label>
                    <label className={s('file-input-label')}>
                      <span>or</span>
                      <a type="button" className={s('hollow', 'button')}>
                        load from a file…
                      </a>
                      <input
                        type="file"
                        onChange={this._handleFileChange}
                        hidden
                      />
                    </label>
                  </div>
                </div>

                <div className={s('row')} style={{marginTop: '1em'}}>
                  <div className={s('large-12', 'columns')}>
                    <input
                      type="submit"
                      className={s('button', {disabled: !valid})}
                      disabled={!valid}
                      value="Search"
                    />
                    <button
                      type="button"
                      className={s('secondary', 'hollow', 'button')}
                      onClick={this._handleReset}
                    >Clear</button>
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

export default withRouter(
  connect(null, {addToast})(IPScanSearch)
);
