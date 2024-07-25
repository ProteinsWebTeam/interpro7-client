import React, { useEffect, useRef, useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { overallDataProgressSelector } from 'reducers/data-progress';

import cssBinder from 'styles/cssBinder';

import styles from './styles.css';

const css = cssBinder(styles);

type Props = {
  progress: number;
};

export const LoadingBar = ({ progress }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [prevProgress, setPrevProgress] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = `scaleX(${progress})`;
    if (prevProgress !== progress) {
      if (progress === 1) ref.current.style.opacity = '0';
      if (prevProgress === 1) ref.current.style.opacity = '1';
    }
    setPrevProgress(progress);
  }, [progress]);

  return (
    <span
      ref={ref}
      className={css('loading_bar')}
      role="progressbar"
      aria-label="Progress for API requests"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={1}
    />
  );
};

const mapStateToProps = createSelector(
  overallDataProgressSelector,
  (progress) => ({ progress }),
);

export default connect(mapStateToProps)(LoadingBar);
