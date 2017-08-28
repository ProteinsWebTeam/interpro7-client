// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import GoTerms from '.';

const renderer = new ShallowRenderer();

describe('External links', () => {
  describe('<GoTerms />', () => {
    test('should render GoTerms component', () => {
      renderer.render(
        <GoTerms
          terms={[
            {
              category: 'biological_process',
              identifier: 'GO:0004930',
              name: 'test1',
            },
            {
              category: 'biological_process',
              identifier: 'GO:0007186',
              name: 'test2',
            },
            {
              category: 'biological_process',
              identifier: 'GO:0016021',
              name: 'test3',
            },
          ]}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    test('should render GOTerms component with empty subset', () => {
      renderer.render(<GoTerms terms={[]} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
