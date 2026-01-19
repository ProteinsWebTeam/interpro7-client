import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Button from 'components/SimpleCommonComponents/Button';
import {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
} from 'actions/creators';

import ReRun from './Group/ReRun';
import { getSequencesData } from '../Status/SequenceList';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

type Props = {
  localID: string;
  status: string;
  withTitle?: boolean;
  forStatus?: boolean;
  versionMismatch?: boolean;
  deleteJob?: typeof deleteJob;
  goToCustomLocation?: typeof goToCustomLocation;
  keepJobAsLocal?: typeof keepJobAsLocal;
  sequence?: string;
  job?: MinimalJobMetadata;
  attributes?: {
    applications?: string[] | null;
    goterms?: string[] | null;
    pathways?: string[] | null;
  };
  MoreActions?: React.ReactNode;
};

export const Actions = ({
  withTitle,
  forStatus,
  status,
  localID,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
  versionMismatch,
  attributes,
  sequence,
  job,
  MoreActions,
}: Props) => {
  useEffect(() => {
    if (job) getSequencesData(job).then((data) => setJobsData(data));
  }, []);

  const [jobsData, setJobsData] = useState<Array<IprscanDataIDB>>([]);

  const _handleDelete = () => {
    deleteJob?.({ metadata: { localID } });
    goToCustomLocation?.({
      description: {
        main: { key: 'result' },
        result: { type: 'InterProScan' },
      },
    });
  };

  return (
    <nav className={css('buttons', { centered: forStatus })}>
      {withTitle && 'Actions: '}

      {forStatus ? (
        <Tooltip title={'Delete this job'}>
          <Button
            type={'inline'}
            icon="icon-trash"
            onClick={_handleDelete}
            aria-label="Delete"
          ></Button>
        </Tooltip>
      ) : (
        <Button
          type={'secondary'}
          icon="icon-trash"
          onClick={_handleDelete}
          aria-label="Delete"
        >
          <span>Delete</span>
        </Button>
      )}

      {!MoreActions && <ReRun jobsPage={true} jobsData={jobsData} />}
      {MoreActions ? MoreActions : null}
    </nav>
  );
};

export default connect(undefined, {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
})(Actions);
