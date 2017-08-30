// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Embed from '.';

const renderer = new ShallowRenderer();

describe('<Embed />', () => {
  test('should render with children as loading component', () => {
    renderer.render(<Embed src="https://www.example.com" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render with default loading component', () => {
    renderer.render(
      <Embed src="https://www.example.com">
        <div>Loading…</div>
      </Embed>
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
