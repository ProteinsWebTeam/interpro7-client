// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { TotalNb } from '.';

const renderer = new ShallowRenderer();

describe('<TotalNb />', () => {
  test('should render', () => {
    renderer.render(
      <TotalNb
        pagination={{ search: 'Virus' }}
        description={{
          main: {
            key: 'proteome',
          },
          proteome: {
            db: 'uniprot',
          },
        }}
        data={[]}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
