import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Controls } from '.';

const renderer = new ShallowRenderer();

describe('<Controls />', () => {
  test('should render', () => {
    renderer.render(
      <Controls
        url={'https://wwwdev.ebi.ac.uk:443/interpro7/api/entry/InterPro/'}
        subset={false}
        entityType={'entry'}
        download={{}}
        downloadURL={() => {}}
        downloadDelete={() => {}}
        count={36713}
        noData={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
