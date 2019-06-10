// @flow
import { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';

import { downloadSelector } from 'reducers/download';

/*:: type Props = {
  children: function,
  url: string
};*/

export class DataPreviewProviderWithoutData extends PureComponent /* ::<Props> */ {
  static propTypes = {
    children: T.func.isRequired,
    url: T.string.isRequired,
  };

  render() {
    const { children, url, ...props } = this.props;
    return children(props);
  }
}

const getMapStateToProps = () =>
  createSelector(
    downloadSelector,
    (_, { url, fileType, subset }) => ({ url, fileType, subset }),
    (downloads, { url, fileType, subset }) => ({
      download:
        downloads[
          [url, fileType, subset && 'subset'].filter(Boolean).join('|')
        ] || {},
    }),
  );

export default loadData({
  getUrl: (_, { url }) => url,
  mapStateToProps: getMapStateToProps(),
})(DataPreviewProviderWithoutData);
