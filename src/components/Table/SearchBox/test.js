// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SearchBox } from '.';

const renderer = new ShallowRenderer();

describe('<SearchBox />', () => {
  test('should render', () => {
    renderer.render(
      <SearchBox
        customLocation={{
          description: {
            main: {
              key: 'proteome',
            },
            proteome: {
              db: 'uniprot',
            },
          },
          hash: 'table',
          search: {
            search: 'virus',
          },
        }}
        goToCustomLocation={() => {}}
        changeSettingsRaw={() => {}}
        loading={false}
      >
        Search organism
      </SearchBox>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
