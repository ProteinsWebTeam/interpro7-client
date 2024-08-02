import React from 'react';

import config from 'config';
import Link from 'components/generic/Link';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

import cssBinder from 'styles/cssBinder';
const f = cssBinder(interproTheme, ipro, fonts);

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
            className={f('white-color')}
            target="_blank"
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
