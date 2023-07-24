import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Title } from '.';

const renderer = new ShallowRenderer();

const data = {
  payload: {
    databases: {
      pfam: { name: 'Pfam' },
      uniprot: { name: 'Uniprot KB' },
      pdb: { name: 'PDB' },
    },
  },
};
describe('<Title />', () => {
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
          data={data}
          mainType="entry"
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
            name: 'VATB_METVS',
            gene: '',
            id: 'VATB_METVS',
            accession: 'A6UP55',
            source_database: 'uniprot',
          }}
          data={data}
          mainType="protein"
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
          data={data}
          mainType="structure"
        />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
