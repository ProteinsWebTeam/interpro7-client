// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';
import {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
} from 'actions/creators';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

/*:: type Props = {
  localID: string,
  status: string,
  withTitle: boolean,
  forStatus?: boolean,
  versionMismatch?: boolean,
  jobs: Object,
  updateJob: function,
  deleteJob: function,
  goToCustomLocation: function,
  keepJobAsLocal: function,
  sequence?: string,
  attributes?: {
    applications: string[] | null,
  }
}*/

export class Actions extends PureComponent /*:: <Props> */ {
  static propTypes = {
    localID: T.string.isRequired,
    status: T.string,
    withTitle: T.bool,
    forStatus: T.bool,
    versionMismatch: T.bool,
    jobs: T.object.isRequired,
    updateJob: T.func.isRequired,
    deleteJob: T.func.isRequired,
    goToCustomLocation: T.func.isRequired,
    keepJobAsLocal: T.func.isRequired,
    sequence: T.string,
    attributes: T.shape({
      applications: T.oneOfType([T.string, T.arrayOf(T.string)]),
    }),
  };

  _handleSaveToggle = () => {
    const { localID, jobs, updateJob } = this.props;
    const { metadata } = jobs[localID];
    updateJob({ metadata: { ...metadata, saved: !metadata.saved } });
  };
  _handleReRun = () => {
    const { sequence, attributes, goToCustomLocation } = this.props;
    const search = {};
    if (attributes?.applications) {
      search.applications =
        typeof attributes.applications === 'string'
          ? [attributes.applications]
          : attributes.applications;
    }
    goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: {
          type: 'sequence',
          value: ((sequence || '').match(/(.{1,60})/g) || []).join('\n'),
        },
      },
      search,
    });
  };

  _handleDelete = () => {
    const { localID, deleteJob, goToCustomLocation } = this.props;
    deleteJob({ metadata: { localID } });
    goToCustomLocation({
      description: {
        main: { key: 'result' },
        result: { type: 'InterProScan' },
      },
    });
  };

  render() {
    // const { localID, withTitle, jobs } = this.props;
    const {
      withTitle,
      forStatus,
      status,
      localID,
      keepJobAsLocal,
      versionMismatch,
    } = this.props;
    // const { saved } = (jobs[localID] || {}).metadata || {};
    return (
      <nav className={f('buttons', { centered: forStatus })}>
        {withTitle && 'Actions: '}
        <Tooltip
          title={
            <div>
              <b>Delete sequence</b>: This will remove the stored data from your
              browser. Remember that search results are only retained on our
              servers for 7 days
            </div>
          }
        >
          <Button
            type="inline"
            icon="icon-trash"
            onClick={this._handleDelete}
            aria-label="Delete Results"
          />
        </Tooltip>
        {status === 'finished' && (
          <Tooltip
            title={
              <div>
                <b>Save results in Browser</b>: If you save the results of this
                search in your browser, you will be able to view it here even
                after it is deleted from our servers or when you are offline.
              </div>
            }
          >
            <Button
              type="inline"
              icon="icon-save"
              onClick={() => keepJobAsLocal(localID)}
              aria-label="Save results in Browser"
            />
          </Tooltip>
        )}
        {versionMismatch && (
          <Tooltip
            title={
              <div>
                <b>Execute the job again</b>: We detected the current results
                were executed with a previous version of InterProScan. Click in
                the button to create a new job with the most recent version.
              </div>
            }
          >
            <Button
              type="hollow"
              icon="icon-history"
              onClick={this._handleReRun}
              aria-label="Execute the job again"
              textColor="var(--colors-light-txt)"
            />
          </Tooltip>
        )}
      </nav>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.jobs,
  (jobs) => ({ jobs }),
);

export default connect(mapStateToProps, {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
})(Actions);
