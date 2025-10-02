import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from '../style.css';

const css = cssBinder(fonts, style);

type Props = { status?: string };
const _StatusTooltip = ({ status }: Props) => (
  <Tooltip title={`Job ${status}`}>
    {(status === 'running' ||
      status === 'queued' ||
      status === 'created' ||
      status === 'importing' ||
      status === 'submitted' ||
      status === 'finished') && (
      <>
        <SpinningCircle />
        <div className={css('status')}>Searching</div>
      </>
    )}

    {status === 'not found' || status === 'failure' || status === 'error' ? (
      <>
        <span
          className={css('icon', 'icon-common', 'ico-notfound')}
          data-icon="&#x78;"
          aria-label="Job failed or not found"
        />{' '}
        {status}
      </>
    ) : null}
    {['finished_with_results', 'imported file', 'saved in browser'].includes(
      status || '',
    ) && (
      <>
        <span
          className={css('icon', 'icon-common', 'ico-confirmed')}
          data-icon="&#xf00c;"
          aria-label="Job finished"
        />{' '}
        {status?.replace('finished_with_results', 'Finished')}
      </>
    )}
  </Tooltip>
);

const StatusTooltip = React.memo(_StatusTooltip);
StatusTooltip.displayName = 'StatusTooltip';

export default StatusTooltip;
