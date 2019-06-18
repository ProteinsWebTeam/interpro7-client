// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { CurrentVersion } from '.';

const renderer = new ShallowRenderer();

describe('<CurrentVersion />', () => {
  test('Current Version should show the proper version', () => {
    renderer.render(
      <CurrentVersion
        data={{
          payload: {
            '71.0': '2018-11-08T00:00:00Z',
            '72.0': '2019-01-17T00:00:00Z',
            '73.0': '2019-03-14T00:00:00Z',
            '74.0': '2019-05-09T00:00:00Z',
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
