import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import GoTerms from '.';

const renderer = new ShallowRenderer();

describe('External links', () => {
  describe('<GoTerms />', () => {
    test('should render GoTerms component', () => {
      renderer.render(
        <GoTerms
          terms={{
            cellular_component: [],
            biological_process: [
              { id: 'GO:0004930', name: 'test1' },
              { id: 'GO:0007186', name: 'test2' },
              { id: 'GO:0016021', name: 'test3' },
            ],
            molecular_function: [],
          }}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    test('should render GOTerms component with empty subset', () => {
      renderer.render(
        <GoTerms
          terms={{
            cellular_component: [],
            biological_process: [],
            molecular_function: [],
          }}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
