// @flow
import React, { useState, useEffect } from 'react';
import T from 'prop-types';

import ResizeObserver from 'wrappers/ResizeObserverComponent/ResizeObserver';
/*:: type Props = {
  element: ?HTMLElement,
  dimension?: 'height' | 'width',
}

  */
const SpaceFiller = ({ element, dimension = 'height' } /*: Props */) => {
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

  return <div style={{ [(dimension /*: string */)]: fillerSpace }} />;
};
SpaceFiller.propTypes = {
  element: T.any,
  dimension: T.string,
};

export default SpaceFiller;
