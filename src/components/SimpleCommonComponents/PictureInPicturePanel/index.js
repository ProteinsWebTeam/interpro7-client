// @flow
import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(style, fonts);

const NUMBER_OF_CHECKS = 10;
const optionsForObserver = {
  root: null,
  rootMargin: '0px',
  /* eslint-disable-next-line prefer-spread */
  threshold: Array.apply(null, { length: NUMBER_OF_CHECKS }).map(
    // $FlowFixMe
    Number.call,
    (n) => (n + 1) / NUMBER_OF_CHECKS,
  ),
};

const PictureInPicturePanel = ({
  className,
  testId,
  hideBar = false,
  OtherControls = null,
  OtherButtons = null,
  onChangingMode = () => null,
  children,
}) => {
  const [isStuck, setStuck] = useState(false);
  const [isMinimized, setMinimized] = useState(false);
  const wrapperRef /*: { current: null | HTMLElement } */ = useRef(null);
  let observer = null;
  const threshold = 0.4;
  useEffect(() => {
    const asynLoadPolyfill = async () => await intersectionObserverPolyfill();
    asynLoadPolyfill();
  }, []);
  useEffect(() => {
    if (wrapperRef?.current) {
      observer = new IntersectionObserver((entries) => {
        setStuck(
          ((wrapperRef?.current?.getBoundingClientRect() /*: any */)?.y || 0) <
            0 && entries[0].intersectionRatio < threshold,
        );
        onChangingMode();
      }, optionsForObserver);
      observer.observe(wrapperRef.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [wrapperRef]);
  return (
    <div ref={wrapperRef} className={f('wrapper')}>
      <div
        className={f(className, {
          'is-stuck': isStuck,
          'is-minimized': isMinimized,
        })}
        data-testid={testId}
      >
        {children}
        <div
          className={f('control-bar', {
            hide: hideBar,
          })}
        >
          {OtherControls}
          <div className={f('controls')}>
            {OtherButtons}
            {isStuck && (
              <button
                data-icon={isMinimized ? '\uF2D0' : '\uF2D1'}
                title={'Minimize'}
                onClick={() => setMinimized(!isMinimized)}
                className={f('control-icon', 'icon', 'icon-common')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PictureInPicturePanel.propTypes = {
  className: T.string,
  testId: T.string,
  hideBar: T.bool,
  OtherControls: T.any,
  OtherButtons: T.any,
  onChangingMode: T.function,
  children: T.any,
};

export default PictureInPicturePanel;
