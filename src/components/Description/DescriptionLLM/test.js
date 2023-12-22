import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import DescriptionLLM from '.';

const renderer = new ShallowRenderer();
const accession = 'PTHR48251';

describe('<DescriptionLLM />', () => {
  test('should render', () => {
    renderer.render(<DescriptionLLM accession={accession} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
