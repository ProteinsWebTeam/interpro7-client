import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  PropsWithChildren,
} from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import cssBinder from 'styles/cssBinder';
import style from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(style, fonts);

const NUMBER_OF_CHECKS = 10;
const optionsForObserver = {
  root: null,
  rootMargin: '0px',
  threshold: Array.from(Array(NUMBER_OF_CHECKS)).map(
    (_, n) => (n + 1) / NUMBER_OF_CHECKS
  ),
};
type Props = {
  className: string;
  hideBar?: boolean;
  OtherControls?: {
    bottom?: ReactNode | null;
    top?: ReactNode | null;
  };
  OtherButtons?: ReactNode | null;
  onChangingMode?: () => void;
  isPIPEnabled?: boolean;
} & PropsWithChildren;

const PictureInPicturePanel = ({
  className,
  hideBar = false,
  OtherControls = { bottom: null, top: null },
  OtherButtons = null,
  onChangingMode = () => null,
  isPIPEnabled = true,
  children,
}: Props) => {
  const [isStuck, setStuck] = useState(false);
  const [isMinimized, setMinimized] = useState(false);
  const wrapperRef /*: { current: null | React$ElementRef<'div'> } */ =
    useRef(null);
  let observer: IntersectionObserver | null = null;
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
          ((current as HTMLElement)?.getBoundingClientRect()?.y || 0) < 0 &&
            entries[0].intersectionRatio < threshold
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
    <div ref={wrapperRef} className={css('wrapper')}>
      <div
        className={css(className, 'content', {
          'is-stuck': isStuck && isPIPEnabled,
          'is-minimized': isMinimized,
        })}
      >
        {!isStuck && <div className={css('controls')}>{OtherControls.top}</div>}
        {children}
        <div
          className={css('control-bar', {
            hide: hideBar,
          })}
        >
          {OtherControls.bottom}
          <div className={css('controls')}>
            {isStuck && isPIPEnabled && OtherControls.top}
            {OtherButtons}
            {isStuck && isPIPEnabled && (
              <button
                data-icon={isMinimized ? '\uF2D0' : '\uF2D1'}
                title={'Minimize'}
                onClick={() => setMinimized(!isMinimized)}
                className={css('control-icon', 'icon', 'icon-common')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: { isPIPEnabled?: boolean }) => ({
    isPIPEnabled: !!ui.isPIPEnabled,
  })
);

export default connect(mapStateToProps)(PictureInPicturePanel);
