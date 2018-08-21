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

const mapStateToPropsFor = (url, fileType, subset) =>
  createSelector(downloadSelector, downloads => ({
    download:
      downloads[
        [url, fileType, subset && 'subset'].filter(Boolean).join('|')
      ] || {},
  }));

export default class DataPreviewProvider extends PureComponent {
  static propTypes = {
    url: T.string.isRequired,
    fileType: T.string.isRequired,
    subset: T.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      DataPreviewProviderWithData: null,
      url: null,
      fileType: null,
      subset: null,
    };
  }

  static getDerivedStateFromProps({ url, fileType, subset }, prevState) {
    if (
      url === prevState.url &&
      fileType === prevState.fileType &&
      subset === prevState.subset
    )
      return null;

    return {
      DataPreviewProviderWithData: loadData({
        getUrl: () => url,
        mapStateToProps: mapStateToPropsFor(url, fileType, subset),
      })(DataPreviewProviderWithoutData),
      url,
      fileType,
      subset,
    };
  }

  render() {
    const { DataPreviewProviderWithData } = this.state;
    return <DataPreviewProviderWithData {...this.props} />;
  }
}
