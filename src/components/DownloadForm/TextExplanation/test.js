import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TextExplanation from '.';

const renderer = new ShallowRenderer();

describe('<TextExplanation />', () => {
  test('should render', () => {
    renderer.render(
      <TextExplanation
        fileType={'accession'}
        description={{
          entry: {
            accession: null,
            db: 'InterPro',
            detail: null,
            integration: null,
            isFilter: null,
            memberDB: null,
            memberDBAccession: null,
            order: null,
          },
          main: {
            key: 'entry',
          },
        }}
        subset={false}
        isStale={false}
        noData={false}
        count={36713}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
