import React from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

const getSearchString = (search?: Record<string, string>): string => {
  const entries = Object.entries(search || []);
  if (entries.length === 0) return '';
  return `?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`;
};

type Props = {
  shouldLinkToResults: boolean;
  title: string;
  count: number;
  subpath?: string;
  fileType: string;
  search?: Record<string, string>;
};

const TooltipContent = ({
  shouldLinkToResults,
  title,
  count,
  subpath,
  fileType,
  search,
}: Props) => {
  return count === 0 ? (
    <div>
      <p className={css('tooltip-paragraph')}>
        <span>No data available</span>
      </p>
    </div>
  ) : (
    <div>
      <h5 style={{ color: 'var(--color-almost-white)' }}>{title}</h5>
      {shouldLinkToResults && (
        <p className={css('tooltip-paragraph')}>
          <Link
            to={{
              description: {
                main: { key: 'result' },
                result: { type: 'download' },
              },
              hash: `${subpath || ''}${getSearchString(search)}|${fileType}`,
            }}
            className={css(
              'vf-button',
              'vf-button--tertiary',
              'vf-button--sm',
              'in-popup',
            )}
          >
            See more download options
          </Link>
        </p>
      )}
    </div>
  );
};

export default TooltipContent;
