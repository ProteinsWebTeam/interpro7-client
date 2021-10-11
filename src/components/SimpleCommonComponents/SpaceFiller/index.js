// @flow
import React, { useState, useEffect } from 'react';
import T from 'prop-types';

import ResizeObserver from 'wrappers/ResizeObserverComponent/ResizeObserver';
import { sleep } from 'timing-functions';

/*:: type Props = {
  element: ?HTMLElement,
  dimension?: 'height' | 'width',
  refresh?: boolean,
}

  */
const ONE_SEC = 1000;

const SpaceFiller = (
  { element, dimension = 'height', refresh } /*: Props */,
) => {
  const [fillerSpace, setFillerSpace] = useState(0);
  const updateDimension = () => {
    if (element) {
      const assigned =
        dimension === 'height'
          ? element?.getBoundingClientRect()?.height || 0
          : element?.getBoundingClientRect()?.width || 0;
      let actual = 0;
      for (const child of element?.children) {
        actual +=
          dimension === 'height'
            ? child?.getBoundingClientRect()?.height || 0
            : child?.getBoundingClientRect()?.width || 0;
      }
      setFillerSpace(actual - assigned);
    }
  };
  const observer = new ResizeObserver(updateDimension);
  useEffect(() => {
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element]);

  useEffect(() => {
    // Forced refresh
    if (refresh)
      // Give time for all the children of the given element to load first to set the filler space right
      sleep(ONE_SEC).then(updateDimension);
  }, [refresh]);

  return <div style={{ [(dimension /*: string */)]: fillerSpace }} />;
};
SpaceFiller.propTypes = {
  element: T.any,
  dimension: T.string,
  refresh: T.bool,
};

export default SpaceFiller;
