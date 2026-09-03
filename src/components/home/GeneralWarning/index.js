import React from 'react';
import T from 'prop-types';
import loadData from 'higherOrder/loadData';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';

const STATUS_OK = 200;
// A banner is a sentence or two. Anything larger is not a warning message.
export const MAX_MESSAGE_LENGTH = 1000;

// The URL is absolute and outside the build output, so a misrouted request can
// answer 200 with something that isn't the warning file at all - the SPA shell,
// a proxy error page. Rendering that verbatim puts a whole HTML document in the
// banner, so only accept a plain-text body of plausible length.
const isPlainTextMessage = (message, headers) => {
  const contentType = headers?.get?.('content-type') || '';
  if (contentType && !contentType.startsWith('text/plain')) return false;
  if (message.length > MAX_MESSAGE_LENGTH) return false;
  return !message.startsWith('<');
};

export const GeneralWarning = ({ data }) => {
  const message = (data?.payload || '').trim();
  if (data?.status !== STATUS_OK || message === '') return null;
  if (!isPlainTextMessage(message, data?.headers)) return null;
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
