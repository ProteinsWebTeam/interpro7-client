import React from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

const getSearchString = (search?: InterProLocationSearch): string => {
  const entries = Object.entries(search || []);
  if (entries.length === 0) return '';
  return `?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`;
};

type Props = {
  title: string;
  count: number;
  subpath?: string;
  fileType: string;
  search?: InterProLocationSearch;
};

const TooltipContent = ({ title, count, subpath, fileType, search }: Props) => {
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
