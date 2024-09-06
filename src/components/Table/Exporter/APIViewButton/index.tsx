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
  url: string;
};
const APIViewButton = ({ url }: Props) => {
  return (
    <Tooltip title="See the raw response from the InterPro API">
      <Link target="_blank" href={url} className={css('no-decoration')}>
        <div
          className={css(
            'vf-button',
            'vf-button--link',
            'vf-button--sm',
            'browse-api-btn',
          )}
        >
          <div className={css('file-button')}>
            <span className={css('as-progress-button')}>
              <span className={css('icon', 'icon-common', 'icon-globe')} />
            </span>
          </div>
        </div>
      </Link>
    </Tooltip>
  );
};
export default APIViewButton;
