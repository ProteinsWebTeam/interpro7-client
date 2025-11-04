import React from 'react';

import { goToCustomLocation } from 'actions/creators';

import Button from 'components/SimpleCommonComponents/Button';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { connect } from 'react-redux';

const mergeSequences = (results: Array<Iprscan5Result>) => {
  let seqs = '';
  let i = 1;
  for (const result of results) {
    seqs += `> ${result.xref?.[0]?.id || `Sequence ${i++}`}\n${(
      (result.sequence || '').match(/(.{1,60})/g) || []
    ).join('\n')}\n`;
  }
  return seqs;
};

type Props = {
  jobsData?: Array<IprscanDataIDB>;
  jobsPage?: boolean;
  goToCustomLocation: typeof goToCustomLocation;
};

const ReRun = ({ jobsData, jobsPage, goToCustomLocation }: Props) => {
  const handleReRun = async () => {
    const search: InterProLocationSearch = {};
    // All jobs should have the same applications so we can t=ake this from the first one.
    const apps = jobsData?.[0]?.applications;
    if (apps) {
      search.applications = typeof apps === 'string' ? [apps] : apps;
    }
    goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: {
          type: 'sequence',
          value: mergeSequences(
            jobsData?.map((jd) => jd.results?.[0]).filter(Boolean) || [],
          ),
        },
      },
      search,
    });
  };

  return (
    <Button
      type={jobsPage ? 'inline' : 'secondary'}
      onClick={handleReRun}
      icon={jobsPage ? 'icon-history' : 'icon-undo'}
      aria-label="Resubmit all sequences"
    >
      {!jobsPage && <span>Resubmit</span>}
    </Button>
  );
};

export default connect(undefined, { goToCustomLocation })(ReRun);
