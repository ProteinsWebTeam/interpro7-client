import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import DescriptionLLM from '.';

const renderer = new ShallowRenderer();
const accession = 'PTHR48251';
const description = '<p>The function of the family is not clear.</p>';

describe('<DescriptionLLM />', () => {
  test('should render', () => {
    renderer.render(
      <DescriptionLLM accession={accession} text={description} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
