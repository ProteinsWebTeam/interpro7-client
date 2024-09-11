import React, { useRef } from 'react';
import { connect } from 'react-redux';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Button from 'components/SimpleCommonComponents/Button';

import { updateJobStatus } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

const TITLE = 'Manually refresh job information';

type Props = {
  updateJobStatus: typeof updateJobStatus;
};

export const RefreshButton = ({ updateJobStatus }: Props) => {
  const _ref = useRef<HTMLSpanElement>(null);
  const _handleClick = () => {
    if (!_ref.current) return;
    if (_ref.current.animate) {
      _ref.current.animate(
        { transform: ['rotate(0)', 'rotate(360deg)'] },
        { duration: 500, iterations: 2 },
      );
    }
    updateJobStatus();
  };
  return (
    <Button aria-label={TITLE} onClick={_handleClick}>
      <Tooltip title={TITLE}>
        <span
          className={css('icon', 'icon-common')}
          data-icon="&#xf2f9;"
          ref={_ref}
        />
      </Tooltip>
    </Button>
  );
};

export default connect(undefined, { updateJobStatus })(RefreshButton);
