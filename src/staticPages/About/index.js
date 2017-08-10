// @flow
import React from 'react';

import Link from 'components/generic/Link';

import DiskUsage from './disk-usage';

import info from './info';
import { pkg } from 'config';

// remove last “.git”
const url = pkg.repository.url.replace('.git', '');

const DeveloperInfo = () =>
  <div>
    <h5>Developer information</h5>
    <div>
      This website has been built at{' '}
      <code>{String(new Date(info.build.time))}</code>
    </div>
    <div>
      It has been built from the repository at:
      <ul>
        <li>
          <Link target="_blank" href={url}>
            <code>
              {url}
            </code>
          </Link>
        </li>
        <li>
          branch:
          <Link target="_blank" href={`${url}/tree/${info.git.branch}`}>
            <code>
              {info.git.branch}
            </code>
          </Link>
        </li>
        {info.git.tag !== info.git.commit &&
          info.git.tag &&
          <li>
            tag:
            <Link target="_blank" href={`${url}/tree/${info.git.tag}`}>
              <code>
                {info.git.tag}
              </code>
            </Link>
          </li>}
        <li>
          commit:
          <Link target="_blank" href={`${url}/tree/${info.git.commit}`}>
            <code>
              {info.git.commit}
            </code>
          </Link>
        </li>
      </ul>
    </div>
  </div>;

export default () =>
  <section>
    <h4>About this website</h4>
    <DiskUsage />
    <DeveloperInfo />
  </section>;
