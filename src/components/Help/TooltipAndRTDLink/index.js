import React from 'react';
import T from 'prop-types';

import config from 'config';
import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(interproTheme, ipro, fonts);

const TooltipAndRTDLink = ({
  rtdPage,
  label = 'Visit our documentation for more information.',
}) => {
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
TooltipAndRTDLink.propTypes = {
  rtdPage: T.string.isRequired,
  label: T.string,
};

export default TooltipAndRTDLink;
