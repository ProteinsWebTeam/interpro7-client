// @flow
/* eslint-disable no-magic-numbers */
import React from 'react';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

export const STATUS_OK = 200;
export const STATUS_NO_CONTENT = 204;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_NOT_FOUND = 404;
export const STATUS_TIMEOUT = 408;
export const STATUS_GONE = 410;
export const STATUS_SERVER_ERROR = 500;

export const edgeCases /*: Map<number, string>*/ = new Map([
  [STATUS_NO_CONTENT, 'There is no data associated with this request'],
  [
    STATUS_NOT_FOUND,
    'There was an error, this is not a known resource on the server',
  ],
  [
    STATUS_TIMEOUT,
    'The query is still running in the background. We will update the page once the data is ready',
  ],
  [STATUS_GONE, 'The data associated with this accession has been removed'],
  [
    STATUS_SERVER_ERROR,
    'The API reported an error, but the cause has not been determined',
  ],
  [
    STATUS_BAD_REQUEST,
    'There was an error, this is not a valid request to the server',
  ],
]);

const message = (text, info = false) => (
  <div className={f('callout', 'withicon', { info, alert: !info })}>{text}</div>
);

const statusMessages = new Map([
  [STATUS_NO_CONTENT, message(edgeCases.get(STATUS_NO_CONTENT), true)],
  [STATUS_BAD_REQUEST, message(edgeCases.get(STATUS_BAD_REQUEST))],
  [STATUS_NOT_FOUND, message(edgeCases.get(STATUS_NOT_FOUND))],
  [STATUS_TIMEOUT, message(edgeCases.get(STATUS_TIMEOUT))],
  [STATUS_SERVER_ERROR, message(edgeCases.get(STATUS_SERVER_ERROR))],
  [503, message(edgeCases.get(STATUS_SERVER_ERROR))],
]);

export default (status /*:: ?: number */) => {
  return statusMessages.get(status);
};
