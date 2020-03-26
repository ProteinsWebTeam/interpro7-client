// @flow§
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Tree } from '.';

const renderer = new ShallowRenderer();

describe('<Tree />', () => {
  test('should render', () => {
    renderer.render(
      <Tree
        data={{
          children: [{ id: '131567', name: 'cellular organisms' }],
          id: '1',
          name: 'root',
        }}
        focused={'1'}
        changeFocus={() => {}}
        labelClick={() => {}}
        initialFisheye={true}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
