import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TimeAgo from '.';

jest.mock('timeago.js', () => {
  const originalModule = jest.requireActual('timeago.js');

  // Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked format'),
    format: jest.fn(() => 'A while ago'),
  };
});

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
