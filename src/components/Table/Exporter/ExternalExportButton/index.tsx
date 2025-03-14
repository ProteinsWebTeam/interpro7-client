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
      title={
        type === 'api'
          ? 'Open results in the browsable API'
          : 'Generate a script to download results on the command line'
      }
    >
      <Link
        target="_blank"
        href={type === 'api' ? url : ''}
        to={
          type === 'scriptgen' && search !== undefined
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
        <div
          className={css(
            'file-button',
            'vf-button',
            'vf-button--link',
            'vf-button--sm',
          )}
        >
          <div className={css('download-btn')}>
            <div className={css('external-link-icon')}>
              <div
                className={css(
                  'icon',
                  `icon-${type === 'api' ? 'generic' : 'common'}`,
                  `icon-${type === 'api' ? 'news' : 'code'}`,
                )}
              ></div>
            </div>
            <div> {type === 'api' ? 'Browsable API' : 'Script generator'} </div>
          </div>
        </div>
      </Link>
    </Tooltip>
  );
};
export default ExternalExportButton;
