import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CrossReferences from '.';

const renderer = new ShallowRenderer();

describe('<CrossReferences />', () => {
  test('should render', () => {
    renderer.render(
      <CrossReferences
        xRefs={{
          prositedoc: {
            accessions: [
              {
                accession: 'PDOC00020',
                url: 'http://prosite.expasy.org/PDOC00020',
              },
            ],
            description:
              'PROSITE is a database of protein families and domains.',
            displayName: 'prositedoc',
            rank: 18,
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
