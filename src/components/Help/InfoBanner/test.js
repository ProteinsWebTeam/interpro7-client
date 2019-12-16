// @flow
import React from 'react';
import TestRenderer from 'react-test-renderer';

import InfoBanner from '.';

describe('<InfoBanner />', () => {
  test('should render', () => {
    const testRenderer = TestRenderer.create(<InfoBanner />);
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
