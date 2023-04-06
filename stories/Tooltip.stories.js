import React from 'react';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

export default {
  title: 'Basic UI/Tooltip',
};

export const Basic = () => (
  <Tooltip title="The info about it">
    <i>Some text</i>
  </Tooltip>
);
