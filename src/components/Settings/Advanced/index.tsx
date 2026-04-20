import React from 'react';

import Link from 'components/generic/Link';

import DiskUsage from './disk-usage';

import info from './info';

import { pkg } from 'config';

// remove last “.git”
const url = pkg.repository.url.replace('.git', '');

const Advanced = () => {
  const devInfo = {
    buildTime: info.build?.time || 0,
    mode: info.mode,
    git: {
      branch: info.git?.branch,
      commit: info.git?.commit,
      tag: info.git?.tag || '',
    },
  };

  return (
    <section>
      <DiskUsage />
      <div>
        <h5> Build commit </h5>
        <code>{devInfo.git.commit}</code>
      </div>
    </section>
  );
};

export default Advanced;
