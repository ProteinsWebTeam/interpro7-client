// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TimeAgo from '.';

const renderer = new ShallowRenderer();

describe('<TimeAgo />', () => {
  test('should render', () => {
    renderer.render(
      <TimeAgo
        date={new Date('June 17, 1998 01:00:00')}
        noUpdate={true}
        title={'17/06/1998'}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
