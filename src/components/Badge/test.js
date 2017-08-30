// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Badge from '.';

const renderer = new ShallowRenderer();

describe('<Badge />', () => {
  test('should render the badge component', () => {
    renderer.render(<Badge>text</Badge>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Badge>{12345}</Badge>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Badge title="test title">text with title</Badge>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
