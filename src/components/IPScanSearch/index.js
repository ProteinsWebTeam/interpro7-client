import React, {Component} from 'react';
import T from 'prop-types';
import {
  Editor, EditorState, ContentState, CompositeDecorator, convertToRaw,
} from 'draft-js';
import {connect} from 'react-redux';
import url from 'url';

import config from 'config';
import {addToast} from 'actions/creators';

import id from 'utils/cheapUniqueId';
import blockEvent from 'utils/blockEvent';

import getTableAccess from 'storage/idb';

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

class IPScanSearch extends Component {
  static propTypes = {
    addToast: T.func.isRequired,
    value: T.string,
    ipScan: T.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(compositeDecorator),
      valid: true,
    };
    this._jobsTA = getTableAccess('interproscan-jobs');
    this._blobsTA = getTableAccess('blobs');
  }

  _storeJob = async (job, jobId) => {
    const jobsTA = await this._jobsTA;
    return jobsTA.set(job, jobId);
  };

  _createAndStoreJob = async ({value}) => {
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
    return {jobId, job};
  };

  _submitSearch = async ({value}) => {
    const body = new FormData();
    body.set('email', config.IPScan.contactEmail);
    body.set('sequence', value);
    const r = await fetch(
      url.resolve(
        url.format({...this.props.ipScan, pathname: this.props.ipScan.root}),
        'run'
      ),
      {method: 'POST', body}
    );
    console.log(r);
    const text = await r.text();
    if (!r.ok) throw new Error(text);
    console.log(text);
    return text;
  };

  _storeSubmittedJob = async ({jobId, job}) => {
    const jobsTA = await this._jobsTA;
    // eslint-disable-next-line no-param-reassign
    job.times.submitted = job.times.lastUpdate = Date.now();
    // eslint-disable-next-line no-param-reassign
    job.status = 'running';
    return jobsTA.set(job, jobId);
  };

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

  _handleSubmitSuccess = ({job, jobId}) => {
    // If job successfully submitted, resets input field
    this._handleReset();
    // Stores the job
    this._storeSubmittedJob({job, jobId});
    // And notifies user
    this.props.addToast({
      title: 'Job submitted',
      body: `Your job has been successfully submitted with an id of ${job.id}`,
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
    // console.log(`POSTing ${value}`);
    let jobAndJobId;
    let IPScanId;
    try {
      [jobAndJobId, IPScanId] = await Promise.all([
        this._createAndStoreJob({value}),
        this._submitSearch({value}),
      ]);
    } catch (err) {
      return this._handleSubmitFail(err);
    }
    console.log({jobAndJobId, IPScanId});
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

  _loadExample = () => this._handleReset(
    `>example protein sequence
MITIDGNGAV ASVAFRTSEV IAIYPITPSST MAEQADAWAGN GLKNVWGDTP RVVEMQSEAG
AIATVHGALQ TGALSTSFTS SQGLLLMIPTL YKLAGELTPFV LHVAARTVAT HALSIFGDHS
DVMAVRQTGC AMLCAANVQE AQDFALISQIA TLKSRVPFIHF FDGFRTSHEI NKIVPLADDT
ILDLMPQVEI DAHRARALNP EHPVIRGTSAN PDTYFQSREAT NPWYNAVYDH VEQAMNDFSA
ATGRQYQPFE YYGHPQAERV IILMGSAIGTC EEVVDELLTRG EKVGVLKVRL YRPFSAKHLL
QALPGSVRSV AVLDRTKEPG AQAEPLYLDVM TALAEAFNNGE RETLPRVIGG RYGLSSKEFG
PDCVLAVFAE LNAAKPKARF TVGIYDDVTNL SLPLPENTLPN SAKLEALFYG LGSDGSVSAT
KNNIKIIGNS TPWYAQGYFV YDSKKAGGLTV SHLRVSEQPIR SAYLISQADF VGCHQLQFID
KYQMAERLKP GGIFLLNTPY SADEVWSRLPQ EVQAVLNQKKA RFYVINAAKI ARECGLAARI
NTVMQMAFFH LTQILPGDSA LAELQGAIAKS YSSKGQDLVER NWQALALARE SVEEVPLQPV
NPHSANRPPV VSDAAPDFVK TVTAAMLAGLG DALPVSALPPD GTWPMGTTRW EKRNIAEEIP
IWKEELCTQC NHCVAACPHS AIRAKVVPPEA MENAPASLHSL DVKSRDMRGQ KYVLQVAPED
CTGCNLCVEV CPAKDRQNPE IKAINMMSRLE HVEEEKINYDF FLNLPEIDRS KLERIDIRTS
QLITPLFEYS GACSGCGETP YIKLLTQLYGD RMLIANATGCS SIYGGNLPST PYTTDANGRG
PAWANSLFED NAEFGLGFRL TVDQHRVRVLR LLDQFADKIPA ELLTALKSDA TPEVRREQVA
ALRQQLNDVA EAHELLRDAD ALVEKSIWLIG GDGWAYDIGFG GLDHVLSLTE NVNILVLDTQ
CYSNTGGQAS KATPLGAVTK FGEHGKRKARK DLGVSMMMYGH VYVAQISLGA QLNQTVKAIQ
EAEAYPGPSL IIAYSPCEEH GYDLALSHDQM RQLTATGFWPL YRFDPRRADE GKLPLALDSR
PPSEAPEETL LHEQRFRRLN SQQPEVAEQLW KDAAADLQKRY DFLAQMAGKA EKSNTD`.trim()
  );

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
                    <div className={s('button-group', 'line-with-buttons')}>
                      <span>or</span>
                      <label className={s('file-input-label')}>
                        <a type="button" className={s('hollow', 'button')}>
                          load from a file…
                        </a>
                        <input
                          type="file"
                          onChange={this._handleFileChange}
                          hidden
                        />
                      </label>
                      <button
                        type="button"
                        className={s('hollow', 'button', 'secondary')}
                        onClick={this._loadExample}
                      >
                        example protein sequence
                      </button>
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

export default connect(
  ({settings: {ipScan}}) => ({ipScan}),
  {addToast}
)(IPScanSearch);
