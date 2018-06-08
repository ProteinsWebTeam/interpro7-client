// @flow
/* eslint-disable no-magic-numbers */

const statusMessages = new Map([
  [204, 'Valid query, but unfortunately no data was available on the server'],
  [
    404,
    'The request timed out, your query is running in the server, try again later',
  ],
  [408, 'There was an error on the server while processing your request'],
]);

export default (status /*:: ?: number */) => {
  return statusMessages.get(status) || 'Unknown status';
};
