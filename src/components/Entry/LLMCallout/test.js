import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import LLMCallout from '.';

const renderer = new ShallowRenderer();
const accession = 'PTHR48251';

describe('<LLMCallout />', () => {
  test('should render', () => {
    renderer.render(<LLMCallout accession={accession} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
