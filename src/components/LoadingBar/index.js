import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataProgressSelector } from 'reducers/data';

import styles from './styles.css';

export class LoadingBar extends PureComponent {
  /* ::
    props: {
      progress: number,
    };
    _node: ?Element;
  */

  static propTypes = {
    progress: T.number.isRequired,
  };

  componentDidMount() {
    this._updateProgress(0, this.props.progress);
  }

  componentDidUpdate({ progress }) {
    this._updateProgress(progress, this.props.progress);
  }

  _updateProgress = (prevProgress, progress) => {
    if (!this._node) return;
    this._node.style.transform = `scaleX(${progress})`;
    if (prevProgress !== progress) {
      if (progress === 1) this._node.style.opacity = '0';
      if (prevProgress === 1) this._node.style.opacity = '1';
    }
  };

  render() {
    const { progress } = this.props;
    return (
      <span
        ref={node => (this._node = node)}
        className={styles.loading_bar}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="1"
      />
    );
  }
}

const mapStateToProps = createSelector(dataProgressSelector, progress => ({
  progress,
}));

export default connect(mapStateToProps)(LoadingBar);
