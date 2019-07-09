// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { updateJob, deleteJob, goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, ipro, local);

/*:: type Props = {
  localID: string,
  withTitle: boolean,
  jobs: Object,
  updateJob: function,
  deleteJob: function,
  goToCustomLocation: function
}*/

export class Actions extends PureComponent /*:: <Props> */ {
  static propTypes = {
    localID: T.string.isRequired,
    withTitle: T.bool,
    jobs: T.object.isRequired,
    updateJob: T.func.isRequired,
    deleteJob: T.func.isRequired,
    goToCustomLocation: T.func.isRequired,
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
    const { withTitle } = this.props;
    // const { saved } = (jobs[localID] || {}).metadata || {};
    return (
      <>
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
        <Tooltip title="Delete job">
          <button
            className={f('icon', 'icon-common', 'ico-neutral')}
            onClick={this._handleDelete}
            data-icon="&#xf1f8;"
            aria-label="Delete job"
          />
        </Tooltip>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.jobs,
  jobs => ({ jobs }),
);

export default connect(
  mapStateToProps,
  {
    updateJob,
    deleteJob,
    goToCustomLocation,
  },
)(Actions);
