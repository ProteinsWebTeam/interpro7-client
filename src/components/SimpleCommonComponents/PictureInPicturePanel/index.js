// @flow
import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(style, fonts);

const NUMBER_OF_CHECKS = 10;
const optionsForObserver = {
  root: null,
  rootMargin: '0px',
  threshold: Array.from(Array(NUMBER_OF_CHECKS)).map(
    (_, n) => (n + 1) / NUMBER_OF_CHECKS,
  ),
};
/*:: type Props = {
  className: string,
  testId: string,
  hideBar:boolean,
  OtherControls: {
    bottom: boolean,
    top: boolean,
  },
  OtherButtons: any,
  onChangingMode: function,
  isPIPEnabled:boolean,
  children: any,
}  */

const PictureInPicturePanel = (
  {
    className,
    testId,
    hideBar = false,
    OtherControls = {},
    OtherButtons = null,
    onChangingMode = () => null,
    isPIPEnabled = true,
    children,
  } /*: Props */,
) => {
  const [isStuck, setStuck] = useState(false);
  const [isMinimized, setMinimized] = useState(false);
  const wrapperRef /*: { current: null | React$ElementRef<'div'> } */ =
    useRef(null);
  let observer = null;
  const threshold = 0.4;
  useEffect(() => {
    const asynLoadPolyfill = async () => await intersectionObserverPolyfill();
    asynLoadPolyfill();
  }, []);
  useEffect(() => {
    if (wrapperRef?.current) {
      const current = wrapperRef.current;
      observer = new IntersectionObserver((entries) => {
        setStuck(
          ((current?.getBoundingClientRect() /*: any */)?.y || 0) < 0 &&
            entries[0].intersectionRatio < threshold,
        );
        onChangingMode();
      }, optionsForObserver);
      observer.observe(current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [wrapperRef]);
  return (
    <div ref={wrapperRef} className={f('wrapper')}>
      <div
        className={f(className, 'content', {
          'is-stuck': isStuck && isPIPEnabled,
          'is-minimized': isMinimized,
        })}
        data-testid={testId}
      >
        {!isStuck && <div className={f('controls')}>{OtherControls.top}</div>}
        {children}
        <div
          className={f('control-bar', {
            hide: hideBar,
          })}
        >
          {OtherControls.bottom}
          <div className={f('controls')}>
            {isStuck && isPIPEnabled && OtherControls.top}
            {OtherButtons}
            {isStuck && isPIPEnabled && (
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
  isPIPEnabled: T.bool,
  OtherControls: T.object,
  OtherButtons: T.any,
  onChangingMode: T.func,
  children: T.any,
};

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({
    isPIPEnabled: !!ui.isPIPEnabled,
  }),
);

export default connect(mapStateToProps)(PictureInPicturePanel);
