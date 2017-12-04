import React from 'react';
import { Tooltip } from 'react-tippy';

export default ({ ...rest }) => {
  return <Tooltip animation="shift" arrow="true" position="bottom" {...rest} />;
};
