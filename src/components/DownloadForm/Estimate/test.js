import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Estimate from '.';

const renderer = new ShallowRenderer();

describe('<Estimate />', () => {
  test('should render', () => {
    renderer.render(
      <Estimate
        data={{
          loading: false,
          payload: {
            count: 36713,
            next: null,
            previous: null,
          },
          ok: true,
          status: 200,
        }}
        isStale={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
