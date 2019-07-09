// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { MenuItem } from '.';

const renderer = new ShallowRenderer();

describe('<MenuItem />', () => {
  test('should render', () => {
    renderer.render(
      <MenuItem
        closeEverything={() => {}}
        to={{
          description: {
            other: ['help'],
          },
        }}
      >
        Help
      </MenuItem>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
