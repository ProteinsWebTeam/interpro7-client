import React from 'react';

import config from 'config';
import Link from 'components/generic/Link';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

import cssBinder from 'styles/cssBinder';
const f = cssBinder(local, fonts);

type TooltipAndRTDLinkProps = {
  rtdPage: string;
  label?: string;
};

const TooltipAndRTDLink = ({
  rtdPage,
  label = 'Visit our documentation for more information.',
}: TooltipAndRTDLinkProps) => {
  return (
    <sup>
      <Tooltip
        interactive
        title={
          <Link
            href={`${config.root.readthedocs.href}${rtdPage}`}
            target="_blank"
            className={f('rtd-link')}
          >
            <span className={f('icon', 'icon-common')} data-icon="&#xf02d;" />{' '}
            {label}
          </Link>
        }
      >
        <span
          className={f('small', 'icon', 'icon-common')}
          data-icon="&#xf129;"
        />
      </Tooltip>
    </sup>
  );
};

export default TooltipAndRTDLink;
