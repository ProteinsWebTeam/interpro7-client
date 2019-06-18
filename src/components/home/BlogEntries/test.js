import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { BlogEntry, BlogEntries } from '.';

const renderer = new ShallowRenderer();

describe('<BlogEntry />', () => {
  test('Blog entry', () => {
    renderer.render(
      <BlogEntry
        category={'interpro'}
        excerpt={'About InterPro'}
        title={'Protein Families classification'}
        url={
          'https://proteinswebteam.github.io/interpro-blog/2017/10/03/Homologous-superfamily/'
        }
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<BlogEntries />', () => {
  test('Blog entries', () => {
    renderer.render(
      <BlogEntries
        data={{
          loading: false,
          payload: [
            {
              category: 'interpro',
              excerpt: 'About InterPro',
              title: 'Protein Families classification',
              url:
                'https://proteinswebteam.github.io/interpro-blog/2017/10/03/Homologous-superfamily/',
            },
          ],
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
