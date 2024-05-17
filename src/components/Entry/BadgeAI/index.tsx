import React from 'react';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

type Props = {
  checked: boolean;
  updated: boolean;
};
import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

export const BadgeCurated = () => {
  return (
    <span className={css('vf-badge', 'vf-badge--tertiary')}>
      Expert-curated
    </span>
  );
};
const BadgeAI = ({ checked, updated }: Props) => {
  return (
    <span className={css('vf-badge', 'vf-badge--tertiary')}>
      AI-generated
      <span className={css('details')}>
        {checked ? 'Reviewed' : 'Unreviewed'}
        {checked && updated && ' and updated'}
      </span>
    </span>
  );
};

export const getTooltipContentFormMetadata = (metadata: EntryMetadata) => {
  let badgeTooltip: string | undefined = undefined;
  if (metadata.is_reviewed_llm) {
    if (metadata.is_updated_llm) {
      badgeTooltip = 'AI-generated | Reviewed and updated';
    } else {
      badgeTooltip = 'AI-generated | Reviewed';
    }
  } else {
    badgeTooltip = 'AI-generated | Unreviewed';
  }
  return badgeTooltip;
};

export const MiniBadgeAI = ({ tooltipText }: { tooltipText?: string }) => {
  const badge = (
    <sup>
      <span className={css('vf-badge', 'vf-badge--tertiary', 'mini')}>AI</span>
    </sup>
  );
  return tooltipText ? <Tooltip title={tooltipText}>{badge}</Tooltip> : badge;
};

export default BadgeAI;
