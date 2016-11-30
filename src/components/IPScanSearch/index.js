import React, {PropTypes as T, Component} from 'react';
import {Editor, EditorState, CompositeDecorator, convertToRaw} from 'draft-js';
import {withRouter} from 'react-router/es';

import {getToastManager} from 'toasts';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
const s = foundationPartial(styles);

const toastManager = getToastManager();

const strategy = re => (block, cb) => {
  const text = block.getText();
  let match;
  while ((match = re.exec(text))) {
    cb(match.index, match.index + match[0].length);
  }
};

const classedSpan = className => ({offsetKey, children}) => (
  <span className={className} data-offset-key={offsetKey}>{children}</span>
);

const checkValidity = (({comment, IUPACProt}) => (
  lines => lines.reduce((acc, line) => (
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
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      valid: true,
    };
  }

  handleClick = event => {
    const value = event.target.dataset.search;
    if (value) this.setState({value});
  };

  handleReset = () => this.setState(
    {
      editorState: EditorState.createEmpty(compositeDecorator),
      valid: true,
    },
    () => this.editor.focus()
  );

  handleSubmitFail = err => {
    // An error happened during job submission
    console.error(err);
    // Displays message and bails
    toastManager.add({
      title: 'Job submission failed',
      body: 'Something wrong happened while trying to submit your job',
      className: s('alert'),
    });
  };

  handleSubmitSuccess = id => {
    // If job successfully submitted, resets input field
    this.handleReset();
    // And notifies user
    toastManager.add({
      title: 'Job submitted',
      body: `Your job has been successfully submitted with an id of ${id}`,
      className: s('success'),
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const lines = convertToRaw(
      this.state.editorState.getCurrentContent()
    ).blocks.map(block => block.text);
    if (!lines.length) return;
    const value = lines.join('\n');
    console.log(`POSTing ${value}`);
    let id;
    try {
      id = await submitSearch(value);
    } catch (err) {
      return this.handleSubmitFail(err);
    }
    this.handleSubmitSuccess(id);
  };

  handleEditorClick = () => {
    this.editor.focus();
  };

  handleChange = editorState => {
    const lines = convertToRaw(editorState.getCurrentContent()).blocks
      .map(block => block.text);
    this.setState({
      editorState,
      valid: checkValidity(lines),
    });
  };

  render() {
    const {editorState, valid} = this.state;
    return (
      <div className={s('row')}>
        <div className={s('large-12', 'columns')}>
          <form onSubmit={this.handleSubmit}>
            <div className={s('secondary', 'callout')}>

              <div className={s('row')}>
                <div className={s('large-12', 'columns')}>
                  <label>Sequence, in FASTA format</label>
                  <div
                    type="text"
                    className={s('editor', {'invalid-block': !valid})}
                    onClick={this.handleEditorClick}
                  >
                    <Editor
                      placeholder="Enter your sequence"
                      editorState={editorState}
                      onChange={this.handleChange}
                      ref={editor => this.editor = editor}
                    />
                  </div>
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
                    className={s('secondary', 'hollow', 'button')}
                    onClick={this.handleReset}
                  >Clear</button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    );
  }
}
IPScanSearch.propTypes = {
  router: T.object,
  value: T.string,
  location: T.shape({
    query: T.object,
  }),
};

export default withRouter(IPScanSearch);
