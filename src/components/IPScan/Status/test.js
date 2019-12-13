// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { IPScanStatus } from '.';

const renderer = new ShallowRenderer();

describe('<IPScanStatus />', () => {
  test('should render', () => {
    renderer.render(
      <IPScanStatus
        jobs={[]}
        search={{}}
        defaultPageSize={20}
        updateJobStatus={() => {}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
