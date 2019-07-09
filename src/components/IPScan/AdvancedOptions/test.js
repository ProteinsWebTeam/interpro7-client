// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { AdvancedOptions } from '.';

const renderer = new ShallowRenderer();

describe('<AdvancedOptions />', () => {
  test('should render', () => {
    renderer.render(
      <AdvancedOptions
        data={{
          loading: false,
          payload: {
            description:
              'A number of different protein sequence applications are launched,' +
              ' These applications search against specific databases and have preconfigured cut off ' +
              'thresholds.',
            name: 'Applications',
            type: 'STRING',
            values: {
              values: [],
            },
          },
          ok: true,
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
