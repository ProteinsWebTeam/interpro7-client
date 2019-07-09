// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { InterProScan } from '.';

const renderer = new ShallowRenderer();

describe('<InterProScan />', () => {
  test('should render with data', () => {
    renderer.render(
      <InterProScan
        data={{
          loading: false,
          payload: {
            tag_name: '5.35-74.0',
            body:
              'release: interproscan-5.35-74.0\r\nMD5: fc003f262608423ab4c96ec099384ca6\r\nCPU: 64 bit\r\nOS: Linux\r\nsize: 9.0GB',
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
