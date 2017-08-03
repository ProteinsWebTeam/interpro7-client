// @flow
import React from 'react';

import info from './info';

export default () =>
  <section>
    <h4>About this website</h4>
    <h5>Developer information</h5>
    <p>
      This website has been built at{' '}
      <code>{String(new Date(info.build.time))}</code>
    </p>
    <p>
      It has been built from the repository at <code>{info.git.remote}</code>,
      branch <code>{info.git.branch}</code>, hash{' '}
      <code title={`tag: ${info.git.tag}`}>{info.git.hash}</code>
    </p>
  </section>;
