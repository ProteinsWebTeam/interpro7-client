// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Children from '.';

const renderer = new ShallowRenderer();

describe('<Children />', () => {
  test('should render', () => {
    renderer.render(
      <Children
        names={{
          '12333': {
            name: 'unclassified bacterial viruses',
            short: 'unclassified bacterial viruses',
          },
          '12877': {
            name: 'Satellites',
            short: 'Satellites',
          },
        }}
        taxChildren={['12333', '12877']}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
