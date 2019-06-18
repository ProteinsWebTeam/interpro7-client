import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SearchByIDA } from '.';

const renderer = new ShallowRenderer();

describe('<SearchByIDA />', () => {
  test('should render', () => {
    renderer.render(
      <SearchByIDA
        customLocation={{
          description: {
            search: {
              type: 'ida',
              value: null,
            },
          },
          hash: '',
          search: {},
          state: {},
        }}
        goToCustomLocation={() => {}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
