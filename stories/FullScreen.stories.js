import React from 'react';
import FullScreenButton from '../src/components/SimpleCommonComponents/FullScreenButton';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

export default {
  title: 'Basic UI/FullScreen',
};

export const Basic = () => {
  return (
    <>
      <div id="sampleDiv">Hello</div>
      <FullScreenButton
        element={document.getElementById('sampleDiv')}
        tooltip="View it in full screen mode"
      />
    </>
  );
};
