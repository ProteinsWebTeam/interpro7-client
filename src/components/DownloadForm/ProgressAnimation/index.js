import React, { PureComponent } from 'react';
import T from 'prop-types';

export default class ProgressAnimation extends PureComponent {
  static propTypes = {
    download: T.shape({
      progress: T.number,
      successful: T.bool,
    }).isRequired,
  };

  render() {
    const {
      download: { progress, successful },
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    return null;
  }
}
