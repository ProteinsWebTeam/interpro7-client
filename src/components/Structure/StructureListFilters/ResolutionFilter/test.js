import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ResolutionFilter } from '.';

const renderer = new ShallowRenderer();

describe('<ResolutionFilter />', () => {
  test('should render', () => {
    renderer.render(
      <ResolutionFilter
        customLocation={{
          description: {
            main: {
              key: 'structure',
            },
            structure: {
              db: 'PDB',
            },
          },
          search: {},
        }}
        goToCustomLocation={() => {}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
