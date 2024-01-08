import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import exporterStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import fileStyle from 'components/File/FileButton/style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(ipro, exporterStyle, fonts, local, fileStyle);

type Props = {
  url: string;
};
const APIViewButton = ({ url }: Props) => {
  return (
    <Tooltip title="See the raw response from the InterPro API">
      <Link target="_blank" href={url} className={css('no-decoration')}>
        <div
          className={css(
            'file-button',
            'vf-button',
            'vf-button--secondary',
            'vf-button--sm',
            'generate-button',
          )}
        >
          <span className={css('as-progress-button')}>
            <span
              className={css('icon', 'icon-common', 'icon-export')}
              data-icon="&#xf233;"
            />
          </span>{' '}
          <span className={css('file-label')}>Web View</span>
        </div>
      </Link>
    </Tooltip>
  );
};
export default APIViewButton;
