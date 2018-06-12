// @flow
/* eslint-disable no-magic-numbers */

const statusMessages = new Map([
  [204, 'Valid query, but unfortunately no data was available on the server'],
  [400, 'There was an error, this is not a valid request to the server'],
  [404, 'There was an error, this is not a known resource on the server'],
  [
    408,
    'The request timed out, your query is running in the server, try again later',
  ],
  [500, 'There was an error while getting data from the server'],
]);

export default (status /*:: ?: number */) => {
  return statusMessages.get(status);
};
