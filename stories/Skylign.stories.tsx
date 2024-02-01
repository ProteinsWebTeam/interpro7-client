import React, { useEffect } from 'react';

import Skylign from 'skylign';
import loadWebComponent from 'utils/load-web-component';
import data from './skylign.json';

export default {
  title: 'InterPro UI/Skylign',
};

export const Basic = () => {
  useEffect(() => {
    loadWebComponent(() => Skylign).as('skylign-component');
  });
  return (
    <div>
      <skylign-component logo={JSON.stringify(data)} />
    </div>
  );
};
