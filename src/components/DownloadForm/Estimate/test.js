// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Estimate from '.';

const renderer = new ShallowRenderer();
// const myHeaders = new Headers({'client-cache': true});

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
          // headers: myHeaders
        }}
        isStale={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
