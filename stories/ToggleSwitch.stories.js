import React from 'react';
import ToggleSwitch from '../src/components/ToggleSwitch';

export default {
  title: 'Basic UI/Switch',
};

export const Basic = () => {
  return <ToggleSwitch id={'storybook-id'} switchCond={null} />;
};
