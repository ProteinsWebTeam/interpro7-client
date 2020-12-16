// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
} from 'actions/creators';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, ipro, local);

/*:: type Props = {
  localID: string,
  status: string,
  withTitle: boolean,
  jobs: Object,
  updateJob: function,
  deleteJob: function,
  goToCustomLocation: function,
  keepJobAsLocal: function
}*/

export class Actions extends PureComponent /*:: <Props> */ {
  static propTypes = {
    localID: T.string.isRequired,
    status: T.string,
    withTitle: T.bool,
    jobs: T.object.isRequired,
    updateJob: T.func.isRequired,
    deleteJob: T.func.isRequired,
    goToCustomLocation: T.func.isRequired,
    keepJobAsLocal: T.func.isRequired,
  };

  _handleSaveToggle = () => {
    const { localID, jobs, updateJob } = this.props;
    const { metadata } = jobs[localID];
    updateJob({ metadata: { ...metadata, saved: !metadata.saved } });
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
    const { withTitle, status, localID, keepJobAsLocal } = this.props;
    // const { saved } = (jobs[localID] || {}).metadata || {};
    return (
      <nav className={f('buttons')}>
        {withTitle && 'Actions: '}
        {/* <Tooltip title="Save job"> */}
        {/* <button */}
        {/* className={f('button', 'tiny', saved ? 'warning' : 'secondary')} */}
        {/* type="button" */}
        {/* onClick={this._handleSaveToggle} */}
        {/* aria-label="Save job" */}
        {/* > */}
        {/* ★ */}
        {/* </button> */}
        {/* </Tooltip> */}
        <Tooltip
          title={
            <div>
              <b>Delete search</b>: This will remove the stored data from your
              browser. Remember that search results are only retained on our
              servers for 7 days
            </div>
          }
        >
          <button
            className={f('icon', 'icon-common', 'ico-neutral')}
            onClick={this._handleDelete}
            data-icon="&#xf1f8;"
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
            <button
              className={f('icon', 'icon-common', 'ico-neutral')}
              data-icon="&#x53;"
              onClick={() => keepJobAsLocal(localID)}
              aria-label="Save results in Browser"
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
