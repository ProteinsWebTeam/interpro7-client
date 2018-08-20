import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

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

export default class DataPreviewProvider extends PureComponent {
  static propTypes = {
    url: T.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      DataPreviewProviderWithData: null,
      url: null,
    };
  }

  static getDerivedStateFromProps({ url }, prevState) {
    if (url === prevState.url) return null;

    return {
      DataPreviewProviderWithData: loadData(() => url)(
        DataPreviewProviderWithoutData,
      ),
      url,
    };
  }

  render() {
    const { DataPreviewProviderWithData } = this.state;
    return <DataPreviewProviderWithData {...this.props} />;
  }
}
