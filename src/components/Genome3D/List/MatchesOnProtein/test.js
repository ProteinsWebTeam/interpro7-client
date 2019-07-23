// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import MatchesOnProtein from '.';

const renderer = new ShallowRenderer();

describe('<MatchesOnProtein />', () => {
  test('should render', () => {
    renderer.render(
      <MatchesOnProtein
        matches={[{ fragments: [{ start: 355, end: 492 }] }]}
        accession={'Q80YC5'}
        tooltip={
          "Predicted domain from Genome3D resource 'pDomTHREADER' based on UniProtKB Q80YC5/355-492 matching classification 1yphC00"
        }
        length={597}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
