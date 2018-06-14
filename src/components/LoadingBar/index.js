// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { overallDataProgressSelector } from 'reducers/data-progress';

import styles from './styles.css';

/*:: type Props = {|
  progress: number,
|}; */

export class LoadingBar extends PureComponent /*:: <Props> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'span'> };
  */

  static propTypes = {
    progress: T.number.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._updateProgress(0, this.props.progress);
  }

  componentDidUpdate({ progress } /*: Props */) {
    this._updateProgress(progress, this.props.progress);
  }

  _updateProgress = (prevProgress, progress) => {
    if (!this._ref.current) return;
    this._ref.current.style.transform = `scaleX(${progress})`;
    if (prevProgress !== progress) {
      if (progress === 1) this._ref.current.style.opacity = '0';
      if (prevProgress === 1) this._ref.current.style.opacity = '1';
    }
  };

  render() {
    const { progress } = this.props;
    return (
      <span
        ref={this._ref}
        className={styles.loading_bar}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="1"
      />
    );
  }
}

const mapStateToProps = createSelector(
  overallDataProgressSelector,
  progress => ({ progress }),
);

export default connect(mapStateToProps)(LoadingBar);
