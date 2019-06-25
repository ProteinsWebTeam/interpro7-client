import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Lineage from '.';

const renderer = new ShallowRenderer();

describe('<Lineage />', () => {
  test('should render', () => {
    renderer.render(
      <Lineage
        lineage={' 1 131567 2 1224 28211 356 335928 99 100 '}
        names={{
          1: {
            name: 'root',
            short: 'root',
          },
          2: {
            name: 'Bacteria',
            short: 'Bacteria (eubacteria)',
          },
          99: {
            name: 'Ancylobacter',
            short: 'Ancylobacter',
          },
          100: {
            name: 'Ancylobacter aquaticus',
            short: 'Ancylobacter aquaticus',
          },
          356: {
            name: 'Rhizobiales',
            short: 'Rhizobiales (rhizobacteria)',
          },
          1224: {
            name: 'Proteobacteria',
            short: 'Proteobacteria',
          },
          28211: {
            name: 'Alphaproteobacteria',
            short: 'Alphaproteobacteria',
          },
          131567: {
            name: 'cellular organisms',
            short: 'cellular organisms',
          },
          335928: {
            name: 'Xanthobacteraceae',
            short: 'Xanthobacteraceae',
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
