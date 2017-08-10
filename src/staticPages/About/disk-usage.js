import React, { PureComponent } from 'react';
import filesize from 'filesize';

const getFileSize = bytes => filesize(bytes, { round: 0, standard: 'iec' });

const support = 'storage' in navigator && 'estimate' in navigator.storage;

const getEstimate = () => {
  if (!support) return { usage: NaN, quota: NaN };
  return navigator.storage.estimate();
};

const PERCENT = 100;

class DiskUsage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { usage: NaN, quota: NaN };
  }

  async componentWillMount() {
    this.setState(await getEstimate());
  }

  render() {
    if (!support) return null;
    const { usage, quota } = this.state;
    let content;
    if (isNaN(usage) || isNaN(quota)) {
      content = 'Unable to determine disk usage…';
    } else {
      content = `Using approximately ${getFileSize(usage)} out of ${getFileSize(
        quota,
      )} of available quota (${Math.round(usage / quota * PERCENT)}%))`;
    }
    return (
      <div>
        <h5>Disk usage</h5>
        <p>
          {content}
        </p>
      </div>
    );
  }
}

export default DiskUsage;
