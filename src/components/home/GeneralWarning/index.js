import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';

const STATUS_OK = 200;
const GeneralWarning = ({ data }) => {
  const message = data?.payload;
  if (data?.status !== STATUS_OK || (message || '').trim() === '') return null;
  return (
    <Callout type="alert">
      <b>{message}</b>
    </Callout>
  );
};
GeneralWarning.propTypes = {
  data: T.object,
  status: T.number,
};

export default loadData({
  getUrl: () => 'https://www.ebi.ac.uk/interpro/static/GENERAL_WARNING.txt',
  fetchOptions: {
    responseType: 'text',
    useCache: false,
  },
})(GeneralWarning);
