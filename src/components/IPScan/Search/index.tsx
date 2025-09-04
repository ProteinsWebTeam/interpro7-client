import React, { FormEvent, PureComponent, RefObject } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import { createJob, goToCustomLocation } from 'actions/creators';
import loadable from 'higherOrder/loadable';

import AdvancedOptions from 'components/IPScan/AdvancedOptions';
import Redirect from 'components/generic/Redirect';
import Link from 'components/generic/Link';
import Callout from 'components/SimpleCommonComponents/Callout';
import Button from 'components/SimpleCommonComponents/Button';

import id from 'utils/cheap-unique-id';
import blockEvent from 'utils/block-event';
import { askNotificationPermission } from 'utils/browser-notifications';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import SequenceInput, {
  SequenceIssue,
  SequenceInputHandle,
} from './SequenceInput';
import example from './example.fasta';

import cssBinder from 'styles/cssBinder';

import blocks from 'styles/blocks.css';
import local from './style.css';
import searchPageCss from 'pages/Search/style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(searchPageCss, local, blocks, buttonCSS, fonts);

export const MAX_NUMBER_OF_SEQUENCES = 100;
const NR_PER_HOUR_JOBS_THRESHOLD = 2;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const checkedSelectorFor = (name: string) => `input[name="${name}"]:checked`;

const getCheckedApplications = (form: HTMLFormElement) =>
  Array.from(
    form.querySelectorAll<HTMLInputElement>(checkedSelectorFor('appl')),
    (input: HTMLInputElement) => input.value,
  );

const isXChecked = (x: string) => (form: HTMLElement) =>
  !!form.querySelector(checkedSelectorFor(x));

const isStayChecked = isXChecked('stay');

function isWithinLast60Minutes(timestamp: number) {
  const now = Date.now(); // current time in milliseconds
  const sixtyMinutesInMs = 60 * 60 * 1000; // 60 minutes in milliseconds

  return now - timestamp <= sixtyMinutesInMs;
}

const getLast60MinJobs = (
  jobs: JobsState,
): { metadata: MinimalJobMetadata }[] =>
  Object.values(jobs).filter((job) => {
    return (
      job['metadata']['status'] !== 'imported file' &&
      job.metadata?.entries == 1 &&
      isWithinLast60Minutes(job.metadata?.times?.created || 0)
    );
  });

type Props = {
  createJob: typeof createJob;
  goToCustomLocation: typeof goToCustomLocation;
  ipScan?: ParsedURLServer;
  value?: string | null;
  main?: string;
  search?: InterProLocationSearch;
  jobs: JobsState;
};

type State = {
  title?: string;
  initialAdvancedOptions?: InterProLocationSearch;
  submittedJob: string | null;
  sequenceIssues: Array<SequenceIssue>;
  dragging: boolean;
  last60minIpScanJobs?: number;
};

export class IPScanSearch extends PureComponent<Props, State> {
  _formRef: RefObject<HTMLFormElement>;
  _editorRef: RefObject<SequenceInputHandle>;
  sequenceToSet?: string | null;

  constructor(props: Props) {
    super(props);

    let initialAdvancedOptions = undefined;

    if (props.search) {
      initialAdvancedOptions = props.search;
    }

    this.state = {
      title: undefined,
      initialAdvancedOptions,
      submittedJob: null,
      sequenceIssues: [],
      dragging: false,
    };

    this._formRef = React.createRef();
    this._editorRef = React.createRef();
    if (this.props.value) this.sequenceToSet = this.props.value;
  }

  componentDidMount(): void {
    if (this.props.jobs) {
      let last60minIpScanJobs: {
        metadata: MinimalJobMetadata;
      }[] = [];

      last60minIpScanJobs = getLast60MinJobs(this.props.jobs);
      this.setState({ last60minIpScanJobs: last60minIpScanJobs.length });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.jobs !== prevProps.jobs) {
      let last60minIpScanJobs: {
        metadata: MinimalJobMetadata;
      }[] = [];
      last60minIpScanJobs = getLast60MinJobs(this.props.jobs);
      this.setState({ last60minIpScanJobs: last60minIpScanJobs.length });
    }
    if (this.sequenceToSet && this._editorRef.current) {
      this._handleReset(this.sequenceToSet);
      this.sequenceToSet = null;
    }
  }

  changeTitle = () => {
    const newTitle = (
      this._formRef.current?.querySelector<HTMLInputElement>(
        'input[name="local-title"]',
      )?.value || ''
    ).trim();
    this.setState({
      title: newTitle,
    });
  };

  _handleReset = (text?: string | unknown) => {
    if (this._formRef.current && typeof text !== 'string') {
      const inputsToReset = Array.from(
        this._formRef.current.querySelectorAll<HTMLInputElement>(
          'input[name]:not([name="stay"])',
        ),
      );
      for (const input of inputsToReset) {
        input.checked = !!input.dataset.defaultchecked;
      }
    }

    this.setState(
      {
        dragging: false,
        title: undefined,
        submittedJob: null,
      },
      () => this._editorRef.current?.focusEditor(),
    );
    this._editorRef.current?.reset(typeof text === 'string' ? text : undefined);
  };

  _handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!this._formRef.current) return;
    const editorContent = this._editorRef.current?.getContent();
    if (!editorContent) return;
    const localID = id(`internal-${Date.now()}`);
    const entries =
      editorContent.split('\n').filter((line) => line.trim().startsWith('>'))
        .length || 1;

    this.props.createJob({
      metadata: {
        localID,
        entries,
        localTitle: this.state.title,
        type: 'InterProScan',
        aboveThreshold:
          (this.state.last60minIpScanJobs &&
            this.state.last60minIpScanJobs >= NR_PER_HOUR_JOBS_THRESHOLD) ||
          false,
        seqtype: isXChecked('seqtype')(this._formRef.current) ? 'n' : 'p',
      },
      data: {
        input: editorContent,
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

  _handleFile = (file: File) => {
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

  _cleanUp = () => this._editorRef.current?.cleanUp();

  _handleDroppedFiles = blockEvent(({ dataTransfer }: DragEvent) => {
    const file = dataTransfer?.files?.[0];
    if (file) this._handleFile(file);
  });

  _handleDragging = blockEvent(() => this.setState({ dragging: true }));

  _handleUndragging = blockEvent(() => this.setState({ dragging: false }));

  _handleFileChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];
    if (file) {
      this._handleFile(file);
      target.value = '';
    }
  };

  render() {
    // If we had a value, we used it in the constructor+componentDidUpdate
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
    const { dragging } = this.state;
    const allOk = this.state.sequenceIssues.length === 0;
    const hasText =
      !!this._editorRef.current && this._editorRef.current?.hasText();

    return (
      <section className={css('vf-stack', 'vf-stack--400')}>
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
          className={css('search-form', { dragging })}
          ref={this._formRef}
        >
          {this.state.last60minIpScanJobs &&
            this.state.last60minIpScanJobs >= NR_PER_HOUR_JOBS_THRESHOLD && (
              <>
                {
                  <Callout type="alert">
                    {' '}
                    You’ve submitted {this.state.last60minIpScanJobs} jobs in
                    the past hour. Our system allows up to{' '}
                    {NR_PER_HOUR_JOBS_THRESHOLD} jobs per hour before new
                    submissions are moved to the low-priority queue. To avoid
                    delays and help reduce server load, we recommend batching
                    your sequences. You can submit up to 100 sequences in a
                    single job instead of sending them one by one.
                  </Callout>
                }
              </>
            )}
          <div>
            <div className={css('simple-box', 'ipscan-block')}>
              <header>Scan your sequences</header>
              <SchemaOrgData
                data={{
                  name: 'Search By Sequence',
                  description: 'Search for InterPro matches in your sequences',
                }}
                processData={schemaProcessDataPageSection}
              />
              <div className={css('vf-stack', 'vf-stack--200')}>
                {this.props.main === 'search' && this.state.submittedJob && (
                  <Callout type="info">
                    Your search job(
                    <span className={css('mono')}>
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
                  </Callout>
                )}
                {this.props.main === 'search' && (
                  <div className={css('description')}>
                    <Helmet>
                      <title>InterProScan</title>
                    </Helmet>
                    <p>
                      This form enables you to submit sequences to the
                      InterProScan web service for scanning against the InterPro
                      protein signature databases.
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
                <SequenceInput
                  value={this.props.value}
                  ref={this._editorRef}
                  onChecksChange={(issues) => {
                    this.setState({ sequenceIssues: issues });
                  }}
                />
              </div>

              <div>
                <label
                  className={css(
                    'vf-button',
                    'vf-button--secondary',
                    'vf-button--sm',
                    'user-select-none',
                  )}
                >
                  <span
                    className={css('icon', 'icon-common', 'icon-folder-open')}
                  />
                  Choose file
                  <input type="file" onChange={this._handleFileChange} hidden />
                </label>
                <Button
                  type="secondary"
                  className={css('user-select-none')}
                  onClick={this._loadExample}
                >
                  Example protein sequence
                </Button>
                <Button
                  className={css({
                    hidden: allOk || !hasText,
                  })}
                  onClick={this._cleanUp}
                  borderColor="var(--colors-alert-main)"
                  backgroundColor="var(--colors-alert-main)"
                >
                  Automatic clean up
                </Button>
              </div>

              <AdvancedOptions
                title={this.state.title}
                changeTitle={this.changeTitle}
                initialOptions={this.state.initialAdvancedOptions}
              />

              <footer>
                <div>
                  <Button
                    submit
                    className={css({
                      disabled: !allOk || !hasText,
                    })}
                    disabled={!allOk || !hasText}
                    value="Search"
                  >
                    Search
                  </Button>
                  <Button type="secondary" onClick={this._handleReset}>
                    Clear
                  </Button>
                </div>
                <div className={css('search-adv')}>
                  <span>Powered by InterProScan</span>
                </div>
              </footer>
            </div>
          </div>
          <div className={css('dragging-overlay')}>Drop your file here</div>
        </form>
      </section>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ipScan,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.jobs,
  (ipScan, desc, search, jobs) => ({
    ipScan,
    value: desc.search.value,
    main: desc.main.key!,
    search,
    jobs,
  }),
);

export default connect(mapStateToProps, {
  createJob,
  goToCustomLocation,
})(IPScanSearch);
