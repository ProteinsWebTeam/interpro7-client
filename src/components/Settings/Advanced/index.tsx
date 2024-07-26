import React from 'react';

import Link from 'components/generic/Link';

import DiskUsage from './disk-usage';

import info from './info';

import { pkg } from 'config';

// remove last “.git”
const url = pkg.repository.url.replace('.git', '');

type gitInfo = {
  branch: string;
  commit: string;
  tag: string;
};

type devInfo = {
  buildTime: Date;
  mode: string;
  git: gitInfo;
};

const Advanced = () => {
  const devInfo: devInfo = {
    buildTime: info.build.time,
    mode: info.mode,
    git: {
      branch: info.git.branch,
      commit: info.git.commit,
      tag: info.git.tag,
    },
  };

  return (
    <section>
      <DiskUsage />
      <div>
        {'This website has been built on '}
        <code>{new Date(devInfo.buildTime).toString()}</code>
      </div>
      <div>
        {'Build mode: '}
        <code>{devInfo.mode}</code>
      </div>
      <div>
        It has been built from the repository at:
        <ul>
          <li>
            <Link target="_blank" href={url}>
              <code>{url}</code>
            </Link>
          </li>
          <li>
            {'branch: '}
            <Link target="_blank" href={`${url}/tree/${devInfo.git.branch}`}>
              <code>{devInfo.git.branch}</code>
            </Link>
          </li>
          {devInfo.git.tag !== devInfo.git.commit && devInfo.git.tag && (
            <li>
              {'tag: '}
              <Link target="_blank" href={`${url}/tree/${devInfo.git.tag}`}>
                <code>{devInfo.git.tag}</code>
              </Link>
            </li>
          )}
          <li>
            {'commit: '}
            <Link target="_blank" href={`${url}/tree/${devInfo.git.commit}`}>
              <code>{devInfo.git.commit}</code>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Advanced;
