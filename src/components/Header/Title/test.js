// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Title } from '.';

const renderer = new ShallowRenderer();

describe('<Title />', () => {
  test('loading, stuck, online', () => {
    renderer.render(
      <Title
        loading
        stuck
        online
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not loading, unstuck, online', () => {
    renderer.render(
      <Title
        loading={false}
        stuck={false}
        online
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('loading, stuck, offline', () => {
    renderer.render(
      <Title
        loading
        stuck
        online={false}
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('not loading, unstuck, offline', () => {
    renderer.render(
      <Title
        loading={false}
        stuck={false}
        online={false}
        mainType="entry"
        mainDB="InterPro"
        mainAccession="IPR000001"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
