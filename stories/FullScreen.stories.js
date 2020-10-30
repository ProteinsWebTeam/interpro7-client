import React, { useRef, useEffect, useState } from 'react';
import FullScreenButton from '../src/components/SimpleCommonComponents/FullScreenButton';

import { foundationPartial } from '../src/styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts);
export default {
  title: 'Basic UI/FullScreen',
};

export const Basic = () => {
  const sampleRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, [sampleRef]);
  return (
    <div ref={sampleRef}>
      Content...
      {rendered ? (
        <FullScreenButton
          element={sampleRef.current}
          className={f('icon', 'icon-common')}
          tooltip="View it in full screen mode"
        />
      ) : null}
    </div>
  );
};

export const usingHooks = () => {
  const sampleRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, [sampleRef]);
  return (
    <div ref={sampleRef}>
      Content...
      {rendered ? (
        <FullScreenButton
          element={sampleRef.current}
          className={f('icon', 'icon-common')}
          tooltip="View it in full screen mode"
          onFullScreenHook={() =>
            (sampleRef.current.style.backgroundColor = 'green')
          }
          onExitFullScreenHook={() =>
            (sampleRef.current.style.backgroundColor = '')
          }
        />
      ) : null}
    </div>
  );
};
