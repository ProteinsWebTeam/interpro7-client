// @flow
import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import { getReadTheDocsURL } from 'higherOrder/loadData/defaults';

import ContentFromRST from 'components/ContentFromRST';

/*:: type DataType = null | {
  ok: bool,
  loading: bool,
  payload: Object,
}; */

const ContentFormReadTheDocs = (
  { data, ...rest } /*: {data: DataType, rest: Array<mixed>} */,
) => {
  if (!data || !data.ok || data.loading) return null;
  return <ContentFromRST {...rest} rstText={data.payload} />;
};
ContentFormReadTheDocs.propTypes = {
  data: T.shape({
    ok: T.bool,
    loading: T.bool,
    payload: T.string,
  }),
};

const mapStateToUrl = createSelector(
  (_, props) => props.page,
  (page) => getReadTheDocsURL(page)(),
);

export default loadData({
  getUrl: mapStateToUrl,
  fetchOptions: {
    responseType: 'text',
  },
})(ContentFormReadTheDocs);
