import React, { useState, useEffect, useCallback } from 'react';
import { filesize } from 'filesize';

const getFileSize = (bytes: number) =>
  filesize(bytes, { round: 0, standard: 'iec' });

const support = 'storage' in navigator && 'estimate' in navigator.storage;

const getEstimate = () => {
  if (!support) return { usage: NaN, quota: NaN };
  return navigator.storage.estimate();
};

const PERCENT = 100;

const DiskUsage = () => {
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>({
    usage: NaN,
    quota: NaN,
  });

  const fetchDiskData = useCallback(async () => {
    const diskData: StorageEstimate = await getEstimate();
    setStorageEstimate({ usage: diskData.usage, quota: diskData.quota });
  }, []);

  useEffect(() => {
    fetchDiskData();
  }, [fetchDiskData]);

  let content: string | number | null = null;

  if (!support) {
    content = null;
  }

  if (storageEstimate.usage !== undefined && storageEstimate.quota) {
    if (isNaN(storageEstimate.usage) || isNaN(storageEstimate.quota)) {
      content = 'Unable to determine disk usage…';
    } else {
      const ratio = Math.round(
        (storageEstimate.usage / storageEstimate.quota) * PERCENT,
      );
      content = `Using approximately ${getFileSize(
        storageEstimate.usage,
      )} out of ${getFileSize(storageEstimate.quota)} of available quota (${
        ratio ? 'about' : 'less than'
      } ${ratio}%)`;
    }
  }

  return (
    <section>
      <h5>Disk usage</h5>
      <p>{content != null && content}</p>
    </section>
  );
};

/*
class DiskUsage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { usage: NaN, quota: NaN };
  }

  async componentDidMount() {
    this.setState(await getEstimate());
  }

  render() {
    if (!support) return null;
    const { usage, quota } = this.state;
    let content;
    if (isNaN(usage) || isNaN(quota)) {
      content = 'Unable to determine disk usage…';
    } else {
      const ratio = Math.round((usage / quota) * PERCENT);
      content = `Using approximately ${getFileSize(usage)} out of ${getFileSize(
        quota,
      )} of available quota (${ratio ? 'about' : 'less than'} ${ratio}%)`;
    }
    return (
      <section>
        <h5>Disk usage</h5>
        <p>{content}</p>
      </section>
    );
  }
}*/

export default DiskUsage;
