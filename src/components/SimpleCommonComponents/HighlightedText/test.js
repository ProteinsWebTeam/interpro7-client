// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import HighlightedText from '.';

const renderer = new ShallowRenderer();

describe('<HighlightedText />', () => {
  test('nothing to highlight', () => {
    renderer.render(<HighlightedText text="some example text" />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('highlight "e"', () => {
    renderer.render(
      <HighlightedText text="some example text" textToHighlight="e" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('highlight "example"', () => {
    renderer.render(
      <HighlightedText text="some example text" textToHighlight="example" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
