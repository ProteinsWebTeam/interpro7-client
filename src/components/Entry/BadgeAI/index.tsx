import React from 'react';

type Props = {
  checked: boolean;
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
const BadgeAI = ({ checked }: Props) => {
  return (
    <span className={css('vf-badge', 'vf-badge--tertiary')}>
      AI-generated
      <span className={css('details')}>
        {checked ? 'Reviewed' : 'Unreviewed'}
      </span>
    </span>
  );
};

export default BadgeAI;
