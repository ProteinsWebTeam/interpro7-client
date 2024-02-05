import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { HelpBanner } from '.';

// TODO: the shallow render  is having issues with React.memo and
// this needs to be changed to TestRenderer, but that approach has
// issues with connects in the inner tree.
const renderer = new ShallowRenderer();

describe.skip('<HelpBanner />', () => {
  test('should render', () => {
    renderer.render(<HelpBanner />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
