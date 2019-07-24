// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { NumberComponent } from '.';

const renderer = new ShallowRenderer();

describe('<NumberComponent />', () => {
  test('should render', () => {
    renderer.render(
      <NumberComponent
        abbr={true}
        label={true}
        lowGraphics={false}
        loading={false}
        dispatch={() => {}}
      >
        36872
      </NumberComponent>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
