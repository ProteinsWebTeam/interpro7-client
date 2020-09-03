import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import { getReadTheDocsURL } from 'higherOrder/loadData/defaults';

import ContentFromRST from 'components/ContentFromRST';

/*:: type DataType = {
  ok: bool,
  payload: Object,
}; */

const ContentFormReadTheDocs = ({ data /*: DataType */, ...rest }) => {
  if (!data || !data.ok || data.loading) return null;
  return <ContentFromRST rstText={data.payload} {...rest} />;
};
ContentFormReadTheDocs.propTypes = {
  data: T.shape({
    ok: T.boolean,
    loading: T.boolean,
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
