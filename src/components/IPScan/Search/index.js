import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import AdvancedOptions from 'components/IPScan/AdvancedOptions';
import Redirect from 'components/generic/Redirect';
import Link from 'components/generic/Link';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { createJob, goToCustomLocation } from 'actions/creators';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import id from 'utils/cheap-unique-id';
import blockEvent from 'utils/block-event';
import { askNotificationPermission } from 'utils/browser-notifications';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import blocks from 'styles/blocks.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import local from './style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

import example from './example.fasta';
import SequenceInput from './SequenceInput';

const f = foundationPartial(
  interproTheme,
  ipro,
  local,
  blocks,
  buttonCSS,
  fonts,
);

export const MAX_NUMBER_OF_SEQUENCES = 100;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const checkedSelectorFor = (x) => `input[name="${x}"]:checked`;

const getCheckedApplications = (form) =>
  Array.from(
    form.querySelectorAll(checkedSelectorFor('appl')),
    (input) => input.value,
  );

const isXChecked = (x) => (form) => !!form.querySelector(checkedSelectorFor(x));

const isStayChecked = isXChecked('stay');

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

    let initialAdvancedOptions = null;

    if (props.search) {
      initialAdvancedOptions = props.search;
    }
    this.state = {
      title: null,
      initialAdvancedOptions,
      submittedJob: null,
      sequenceChecks: {},
    };

    this._formRef = React.createRef();
    this._editorRef = React.createRef();
    if (this.props.value) this.sequenceToSet = this.props.value;
  }
  componentDidUpdate() {
    if (this.sequenceToSet && this._editorRef.current) {
      this._handleReset(this.sequenceToSet);
      this.sequenceToSet = null;
    }
  }

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

    this.setState(
      {
        dragging: false,
        uploading: false,
        title: null,
        submittedJob: null,
      },
      this._editorRef.current.focusEditor(),
    );
    this._editorRef.current.reset(typeof text === 'string' ? text : undefined);
  };

  _handleSubmit = (event) => {
    event.preventDefault();
    if (!this._formRef.current) return;
    const editorContent = this._editorRef.current.getContent();
    if (!editorContent) return;
    const localID = id(`internal-${Date.now()}`);
    this.props.createJob({
      metadata: {
        localID,
        group: this.state.title,
        type: 'InterProScan',
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

  _cleanUp = () => this._editorRef.current.cleanUp();

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
    const { dragging } = this.state;
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
                  'simple-box',
                  'border',
                  'margin-bottom-none',
                  'ipscan-block',
                )}
              >
                <div className={f('row')}>
                  <div className={f('large-12', 'columns', 'search-input')}>
                    {this.props.main === 'search' &&
                      this.state.submittedJob && (
                        <Callout type="info">
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
                        </Callout>
                      )}
                    <h3 className={f('light')}>Sequence, in FASTA format</h3>
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
                    <SequenceInput
                      value={this.props.value}
                      ref={this._editorRef}
                      onChecksChange={(tests) => {
                        this.setState({ sequenceChecks: tests });
                      }}
                    />
                  </div>
                </div>

                <div className={f('row')}>
                  <div className={f('columns')}>
                    <div className={f('button-group', 'line-with-buttons')}>
                      <label
                        className={`vf-button ${f(
                          'vf-button',
                          'vf-button--secondary',
                          'vf-button--sm',
                          'user-select-none',
                        )}`}
                      >
                        <span
                          className={f(
                            'icon',
                            'icon-common',
                            'icon-folder-open',
                          )}
                        />
                        Choose file
                        <input
                          type="file"
                          onChange={this._handleFileChange}
                          hidden
                        />
                      </label>
                      <Button
                        type="secondary"
                        className={f('user-select-none')}
                        onClick={this._loadExample}
                      >
                        Example protein sequence
                      </Button>
                      <Button
                        className={f({
                          hidden:
                            this.state.sequenceChecks.valid ||
                            !this.state.sequenceChecks.hasText,
                        })}
                        onClick={this._cleanUp}
                        borderColor="var(--colors-alert-main)"
                        backgroundColor="var(--colors-alert-main)"
                      >
                        Automatic FASTA clean up
                      </Button>
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
                      'line-with-buttons',
                    )}
                  >
                    <Button
                      submit
                      className={f({
                        disabled: !this.state.sequenceChecks.valid,
                      })}
                      disabled={
                        this.state.sequenceChecks.tooShort ||
                        !this.state.sequenceChecks.valid
                      }
                      value="Search"
                    >
                      Search
                    </Button>
                    <Button type="secondary" onClick={this._handleReset}>
                      Clear
                    </Button>
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
