// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Title } from '.';

const renderer = new ShallowRenderer();

describe('<Title />', () => {
  test('loading, stuck', () => {
    renderer.render(
      <Title
        loading
        stuck
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not loading, unstuck', () => {
    renderer.render(
      <Title
        loading={false}
        stuck={false}
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
