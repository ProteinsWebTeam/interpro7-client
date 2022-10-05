// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { deleteJob } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const f = foundationPartial(fonts, ipro, local);

/*::
type Props = {
  group: string,
  deleteJob: (string)=>void,
  jobs: {
    [string]: {
      metadata: {
        group:string
      }
    }
  },
}
  */
const GroupActions = ({ group, jobs, deleteJob } /*: Props */) => {
  const handleDelete = () => {
    // prettier-ignore
    (Object.values(jobs)/*: any */)
      .filter(
        ({ metadata } /*: {metadata:{group: string}} */) =>
          metadata.group === group,
      )
      .forEach((job) => deleteJob(job));
  };

  return (
    <nav className={f('buttons')}>
      <Tooltip
        title={
          <div>
            <b>Delete Job</b>: This will remove the stored data of all the
            sequences associated with this job from your browser. Remember that
            search results are only retained on our servers for 7 days
          </div>
        }
      >
        <button
          className={f('icon', 'icon-common', 'ico-neutral', 'group')}
          onClick={handleDelete}
          data-icon="&#xf1f8;"
          aria-label="Delete Results"
        />
      </Tooltip>
    </nav>
  );
};
GroupActions.propTypes = {
  group: T.string.isRequired,
  jobs: T.object,
  deleteJob: T.func,
};

const mapStateToProps = createSelector(
  (state) => state.jobs,
  (jobs) => ({ jobs }),
);

export default connect(mapStateToProps, {
  deleteJob,
})(GroupActions);
