import React from 'react';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

type Props = {
  title: string;
  count: number;
  subpath?: string;
  fileType: string;
  search?: InterProLocationSearch;
};

const TooltipContent = ({ title, count }: Props) => {
  return count === 0 ? (
    <div>
      <p className={css('tooltip-paragraph')}>
        <span>No data available</span>
      </p>
    </div>
  ) : (
    <div>
      <span style={{ color: 'var(--color-almost-white)' }}>{title}</span>
    </div>
  );
};

export default TooltipContent;
