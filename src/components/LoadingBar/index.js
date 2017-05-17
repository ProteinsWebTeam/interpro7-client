import React, {PureComponent} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import styles from './styles.css';

class LoadingBar extends PureComponent {
  static propTypes = {
    progress: T.number.isRequired,
  };

  render() {
    const {progress} = this.props;
    const scaleY = (progress === 1 ? 0 : 1);
    return (
      <span
        className={styles.loading_bar}
        style={{transform: `scaleX(${progress}) scaleY(${scaleY})`}}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.data,
  (data = {}) => {
    const values = Object.values(data);
    const progress = values.reduce(
      (acc, {loading}) => acc + 1 / (loading ? 2 : 1),
      0
    ) / values.length;
    return ({progress: isNaN(progress) ? 1 : progress});
  },
);

export default connect(mapStateToProps)(LoadingBar);
