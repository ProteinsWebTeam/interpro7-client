// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DownloadTable } from '.';

const renderer = new ShallowRenderer();

describe('<DownloadTable />', () => {
  test('should render', () => {
    renderer.render(
      <DownloadTable
        data={{
          loading: false,
          payload: {
            url:
              'https://api.github.com/repos/ebi-pf-team/interproscan/releases/17364434',
            assets_url:
              'https://api.github.com/repos/ebi-pf-team/interproscan/releases/17364434/assets',
            upload_url:
              'https://uploads.github.com/repos/ebi-pf-team/interproscan/releases/17364434/assets{?name,label}',
            html_url:
              'https://github.com/ebi-pf-team/interproscan/releases/tag/5.35-74.0',
            id: 17364434,
            node_id: 'MDc6UmVsZWFzZTE3MzY0NDM0',
            tag_name: '5.35-74.0',
            target_commitish: 'release-5.35-74.0',
            name: 'interproscan-5.35-74.0',
            draft: false,
            author: {
              login: 'mifraser',
              id: 13431684,
              node_id: 'MDQ6VXNlcjEzNDMxNjg0',
              avatar_url:
                'https://avatars0.githubusercontent.com/u/13431684?v=4',
              gravatar_id: '',
              url: 'https://api.github.com/users/mifraser',
              html_url: 'https://github.com/mifraser',
              followers_url: 'https://api.github.com/users/mifraser/followers',
              following_url:
                'https://api.github.com/users/mifraser/following{/other_user}',
              gists_url:
                'https://api.github.com/users/mifraser/gists{/gist_id}',
              starred_url:
                'https://api.github.com/users/mifraser/starred{/owner}{/repo}',
              subscriptions_url:
                'https://api.github.com/users/mifraser/subscriptions',
              organizations_url: 'https://api.github.com/users/mifraser/orgs',
              repos_url: 'https://api.github.com/users/mifraser/repos',
              events_url:
                'https://api.github.com/users/mifraser/events{/privacy}',
              received_events_url:
                'https://api.github.com/users/mifraser/received_events',
              type: 'User',
              site_admin: false,
            },
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
