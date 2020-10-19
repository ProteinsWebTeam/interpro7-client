import React, { useRef } from 'react';
import FullScreenButton from '../src/components/SimpleCommonComponents/FullScreenButton';

export default {
  title: 'Basic UI/FullScreen',
};

export const Basic = () => {
  const sampleRef = useRef();
  return (
    <>
      <div id="sampleDiv" ref={sampleRef}>
        Hello
      </div>
      <FullScreenButton
        element={sampleRef}
        tooltip="View it in full screen mode"
      />
    </>
  );
};
