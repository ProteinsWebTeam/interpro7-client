import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import GoTerms from '.';

const renderer = new ShallowRenderer();

const TEST_DBS = new Set([
  { type: 'entry', db: 'interpro' },
  { type: 'entry', db: 'pfam' },
  { type: 'protein', db: 'reviewed' },
]);

describe('External links', () => {
  describe('<GoTerms />', () => {
    for (const { type, db } of TEST_DBS) {
      describe(`${type}: ${db}`, () => {
        test('should render GoTerms component', () => {
          renderer.render(
            <GoTerms
              type={type}
              db={db}
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
          renderer.render(
            <GoTerms
              type={type}
              db={db}
              terms={[
                {
                  category: 'biological_process',
                  identifier: 'GO:0004930',
                  name: 'test1',
                },
                {
                  category: 'molecular_function',
                  identifier: 'GO:0004930',
                  name: 'test2',
                },
              ]}
            />,
          );
          expect(renderer.getRenderOutput()).toMatchSnapshot();
        });

        test('should render GOTerms component with empty subset', () => {
          renderer.render(<GoTerms type={type} db={db} terms={[]} />);
          expect(renderer.getRenderOutput()).toMatchSnapshot();
        });
      });
    }
  });
});
