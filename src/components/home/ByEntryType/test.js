// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ByEntryType } from '.';

const renderer = new ShallowRenderer();

describe('<ByEntryType />', () => {
  test('Entry types', () => {
    renderer.render(
      <ByEntryType
        data={{
          payload: {
            active_site: 132,
            binding_site: 76,
            conserved_site: 688,
            domain: 10637,
            family: 21769,
            homologous_superfamily: 3078,
            ptm: 17,
            repeat: 316,
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
