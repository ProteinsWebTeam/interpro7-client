// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Species, BySpecies } from '.';

const renderer = new ShallowRenderer();

describe('<Species />', () => {
  test('Species', () => {
    renderer.render(
      <Species
        species={{
          color: '#d9534f',
          description: 'Homo sapiens',
          icon: 'H',
          kingdom: 'Eukaryota',
          tax_id: '9606',
          title: 'Human',
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<BySpecies />', () => {
  test('By Species', () => {
    renderer.render(
      <BySpecies
        data={{
          payload: {
            9606: {
              title: 'Homo sapiens',
              value: 64093,
            },
          },
        }}
        dataProtein={{
          payload: {
            9606: {
              title: 'Homo sapiens',
              value: 170588,
            },
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
