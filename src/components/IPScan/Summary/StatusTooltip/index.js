// @flow
import React from 'react';
import T from 'prop-types';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from '../style.css';

const f = foundationPartial(fonts, style);

const _StatusTooltip = ({ status /*: string */ }) => (
  <Tooltip title={`Job ${status}`}>
    {(status === 'running' ||
      status === 'created' ||
      status === 'importing' ||
      status === 'submitted') && (
      <>
        <SpinningCircle />
        <div className={f('status')}>Searching</div>
      </>
    )}

    {status === 'not found' || status === 'failure' || status === 'error' ? (
      <>
        <span
          className={f('icon', 'icon-common', 'ico-notfound')}
          data-icon="&#x78;"
          aria-label="Job failed or not found"
        />{' '}
        {status}
      </>
    ) : null}
    {['finished', 'imported file', 'saved in browser'].includes(status) && (
      <>
        <span
          className={f('icon', 'icon-common', 'ico-confirmed')}
          data-icon="&#xf00c;"
          aria-label="Job finished"
        />{' '}
        {status}
      </>
    )}
  </Tooltip>
);
_StatusTooltip.propTypes = {
  status: T.oneOf([
    'running',
    'created',
    'importing',
    'imported file',
    'saved in browser',
    'submitted',
    'not found',
    'failure',
    'error',
    'finished',
  ]),
};
const StatusTooltip = React.memo(_StatusTooltip);
StatusTooltip.displayName = 'StatusTooltip';

export default StatusTooltip;
