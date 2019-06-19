// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Actions } from '.';

const renderer = new ShallowRenderer();

describe('<Actions />', () => {
  test('should render', () => {
    renderer.render(
      <Actions
        localID={'internal-1560936888649-1'}
        jobs={{
          'internal-1560936888649-1': {
            metaData: {
              localID: 'internal-1560936888649-1',
              localTitle: null,
              remoteID: null,
              saved: false,
              status: 'created',
              times: {
                created: 1560936888650,
                lastUpdate: 1560936888650,
              },
              type: 'InterProScan',
            },
          },
        }}
        deleteJob={() => {}}
        goToCustomLocation={() => {}}
        updateJob={() => {}}
        withTitle={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
