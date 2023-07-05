import React from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import local from './style.css';

const css = cssBinder(local);

type Props = {
  shouldLinkToResults: boolean;
  title: string;
  count: number;
  subpath?: string;
  fileType: string;
};

const TooltipContent = ({
  shouldLinkToResults,
  title,
  count,
  subpath,
  fileType,
}: Props) => {
  return count === 0 ? (
    <div>
      <p className={css('tooltip-paragraph')}>
        <span>No data available</span>
      </p>
    </div>
  ) : (
    <div>
      <p className={css('tooltip-paragraph')}>
        <span>{title}</span>
      </p>
      {shouldLinkToResults && (
        <p className={css('tooltip-paragraph')}>
          <Link
            to={{
              description: {
                main: { key: 'result' },
                result: { type: 'download' },
              },
              hash: `${subpath || ''}|${fileType}`,
            }}
            className={css(
              'vf-button',
              'vf-button--tertiary',
              'vf-button--sm',
              'in-popup'
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
