// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ProgressButton from '.';

const renderer = new ShallowRenderer();

describe('<ProgressButton />', () => {
  test('should render, first step', () => {
    renderer.render(
      <ProgressButton
        downloading={true}
        success={false}
        failed={false}
        progress={0}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render, with progress', () => {
    renderer.render(
      <ProgressButton
        downloading={true}
        success={false}
        failed={false}
        progress={0.5}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render, with success', () => {
    renderer.render(
      <ProgressButton
        downloading={false}
        success={true}
        failed={false}
        progress={1}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render, with failure', () => {
    renderer.render(
      <ProgressButton
        downloading={false}
        success={true}
        failed={true}
        progress={0.8}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
