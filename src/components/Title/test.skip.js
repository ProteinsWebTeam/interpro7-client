import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Title from '.';

const renderer = new ShallowRenderer();

describe.skip('<Title />', () => {
  describe('For an entry', () => {
    test('should render a title component correctly', () => {
      renderer.render(
        <Title
          metadata={{
            name: {
              name: 'Piwi domain',
            },
            type: 'domain',
            accession: 'PF02171',
            source_database: 'pfam',
          }}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('For a protein', () => {
    test('should render a title component correctly', () => {
      renderer.render(
        <Title
          metadata={{
            length: 462,
            description: ["Created on Monday 13 August 2007 by user 'UJJWAL'"],
            name: {
              other: [],
              name: 'VATB_METVS',
              short: '',
            },
            gene: '',
            id: 'VATB_METVS',
            accession: 'A6UP55',
          }}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('For a structure', () => {
    test('should render a title component correctly', () => {
      renderer.render(
        <Title
          metadata={{
            name: {
              name: 'RING-domain heterodimer',
            },
            accession: '1JM7',
            source_database: 'pdb',
            experiment_type: 'Solution NMR',
            release_date: '2009-02-24',
            chains: ['A', 'B'],
          }}
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
