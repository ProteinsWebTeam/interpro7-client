// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import LoadingComponent, { LoadingMessage, ErrorMessage } from '.';

describe('<LoadingComponent />', () => {
  const renderer = new ShallowRenderer();

  test('should render in loading state before delay and time out', () => {
    renderer.render(
      <LoadingComponent isLoading timedOut={false} pastDelay={false} />,
    );
    expect(renderer.getRenderOutput()).toBeNull();
  });

  test('should render in loading state after delay but before time out', () => {
    renderer.render(<LoadingComponent isLoading timedOut={false} pastDelay />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render in loading state after delay and time out', () => {
    renderer.render(<LoadingComponent isLoading timedOut={false} pastDelay />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render in with error', () => {
    renderer.render(
      <LoadingComponent
        isLoading={false}
        timedOut={false}
        pastDelay={false}
        error={new Error('Something happened…')}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render even if not loading and not errored', () => {
    renderer.render(
      <LoadingComponent isLoading={false} timedOut={false} pastDelay={false} />,
    );
    expect(renderer.getRenderOutput()).toBeNull();
  });
});

describe('<LoadingMessage />', () => {
  const renderer = new ShallowRenderer();

  test('should render loading message', () => {
    renderer.render(<LoadingMessage />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<ErrorMessage />', () => {
  const renderer = new ShallowRenderer();

  test('should render error message', () => {
    renderer.render(<ErrorMessage />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
