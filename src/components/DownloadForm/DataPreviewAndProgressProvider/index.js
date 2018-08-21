import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';

import { downloadSelector } from 'reducers/download';

export class DataPreviewProviderWithoutData extends PureComponent {
  static propTypes = {
    children: T.func.isRequired,
    url: T.string.isRequired,
  };

  render() {
    const { children, url, ...props } = this.props;
    return children(props);
  }
}

const mapStateToPropsFor = (url, fileType) =>
  createSelector(downloadSelector, downloads => ({
    download: downloads[`${url}|${fileType}`] || {},
  }));

export default class DataPreviewProvider extends PureComponent {
  static propTypes = {
    url: T.string.isRequired,
    fileType: T.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      DataPreviewProviderWithData: null,
      url: null,
      fileType: null,
    };
  }

  static getDerivedStateFromProps({ url, fileType }, prevState) {
    if (url === prevState.url && fileType === prevState.fileType) return null;

    return {
      DataPreviewProviderWithData: loadData({
        getUrl: () => url,
        mapStateToProps: mapStateToPropsFor(url, fileType),
      })(DataPreviewProviderWithoutData),
      url,
      fileType,
    };
  }

  render() {
    const { DataPreviewProviderWithData } = this.state;
    return <DataPreviewProviderWithData {...this.props} />;
  }
}
