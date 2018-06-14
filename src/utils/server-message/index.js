// @flow
/* eslint-disable no-magic-numbers */
import React from 'react';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const message = (text, info = false) => (
  <div className={f('callout', 'withicon', { info, alert: !info })}>{text}</div>
);

const statusMessages = new Map([
  [
    204,
    message(
      'Valid query, but unfortunately no data was available on the server',
      true,
    ),
  ],
  [
    400,
    message('There was an error, this is not a valid request to the server'),
  ],
  [
    404,
    message('There was an error, this is not a known resource on the server'),
  ],
  [
    408,
    message(
      'The request timed out, your query is running in the server, try again later',
    ),
  ],
  [500, message('There was an error while getting data from the server')],
]);

export default (status /*:: ?: number */) => {
  return statusMessages.get(status);
};
