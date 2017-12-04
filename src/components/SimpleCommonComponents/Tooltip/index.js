import React from 'react';
import { Tooltip } from 'react-tippy';

const _Tooltip = ({ ...rest }) => (
  <Tooltip animation="shift" arrow="true" position="bottom" {...rest} />
);
_Tooltip.displayName = 'Tooltip';

export default _Tooltip;
