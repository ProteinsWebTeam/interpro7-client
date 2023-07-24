import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MemberSymbol from '.';

const renderer = new ShallowRenderer();

describe('<MemberSymbol />', () => {
  test('should render', () => {
    renderer.render(<MemberSymbol type={'smart'} includeLink={true} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
