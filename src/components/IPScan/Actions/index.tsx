import React from 'react';
import { connect } from 'react-redux';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Button from 'components/SimpleCommonComponents/Button';
import {
  updateJob,
  deleteJob,
  goToCustomLocation,
  keepJobAsLocal,
} from 'actions/creators';

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
  MoreActions,
}: Props) => {
  const _handleReRun = () => {
    const search: InterProLocationSearch = {};
    if (attributes?.applications) {
      search.applications =
        typeof attributes.applications === 'string'
          ? [attributes.applications]
          : attributes.applications;
    }
    goToCustomLocation?.({
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
      <Tooltip title={<div>Delete this job</div>}>
        {}
        <Button
          type={forStatus ? 'inline' : 'secondary'}
          icon="icon-trash"
          onClick={_handleDelete}
          aria-label="Delete Results"
        >
          {!forStatus && <span>Delete Results</span>}
        </Button>
      </Tooltip>
      {status === 'finished_with_results' && (
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
            type={forStatus ? 'inline' : 'secondary'}
            icon="icon-save"
            onClick={() => keepJobAsLocal?.(localID)}
            aria-label="Save results in Browser"
          >
            {!forStatus && <span>Save results in Browser</span>}
          </Button>
        </Tooltip>
      )}
      {versionMismatch && (
        <Tooltip
          title={
            <div>
              <b>Execute the job again</b>: We detected the current results were
              executed with a previous version of InterProScan. Click in the
              button to create a new job with the most recent version.
            </div>
          }
        >
          <Button
            type="hollow"
            icon="icon-history"
            onClick={_handleReRun}
            aria-label="Execute the job again"
            textColor="var(--colors-light-txt)"
          />
        </Tooltip>
      )}
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
