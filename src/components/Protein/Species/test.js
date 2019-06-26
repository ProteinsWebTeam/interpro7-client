// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Species from '.';

const renderer = new ShallowRenderer();

describe('<Species />', () => {
  test('should render', () => {
    renderer.render(
      <Species taxID={'67581'} fullName={'Streptomyces viridosporus'} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
