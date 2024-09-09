import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import fileButton from '../../../File/FileButton/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const css = cssBinder(local, fonts, buttonCSS, fileButton);

type Props = {
  url?: string;
  type: 'api' | 'scriptgen';
  search?: InterProLocationSearch;
  subpath?: string;
};

const getSearchString = (search?: InterProLocationSearch): string => {
  const entries = Object.entries(search || []);
  if (entries.length === 0) return '';
  return `?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`;
};

const ExternalExportButton = ({ url, type, search, subpath }: Props) => {
  return (
    <Tooltip
      className={css('browse-btn-api')}
      title={
        type == 'api'
          ? 'See the raw response from the InterPro API'
          : 'Generate script to get JSON data'
      }
    >
      <Link
        target="_blank"
        href={type == 'api' ? url : ''}
        to={
          type == 'scriptgen' && search !== undefined
            ? {
                description: {
                  main: { key: 'result' },
                  result: { type: 'download' },
                },
                hash: `${subpath || ''}${getSearchString(search)}|json`,
              }
            : { description: {} }
        }
        className={css('no-decoration')}
      >
        <div className={css('vf-button', 'vf-button--link', 'vf-button--sm')}>
          <div className={css('file-button')}>
            <span
              className={css(
                'icon',
                'icon-common',
                `icon-${type == 'api' ? 'globe' : 'code'}`,
              )}
            />
          </div>
        </div>
      </Link>
    </Tooltip>
  );
};
export default ExternalExportButton;
