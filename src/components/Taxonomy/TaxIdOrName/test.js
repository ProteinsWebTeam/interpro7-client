// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TaxIdOrName from '.';

const renderer = new ShallowRenderer();

describe('<TaxIdOrName />', () => {
  test('should render', () => {
    renderer.render(<TaxIdOrName accession={'1'} name={{ short: 'root' }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
