// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { IPScanSearch } from '.';

jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

const renderer = new ShallowRenderer();

describe('<IPScanSearch />', () => {
  test('should render', () => {
    renderer.render(
      <IPScanSearch
        createJob={() => {}}
        goToCustomLocation={() => {}}
        ipScan={{
          hostname: 'www.ebi.ac.uk',
          port: '443',
          protocol: 'https:',
          root: '/Tools/services/rest/iprscan5/',
        }}
        value={''}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
