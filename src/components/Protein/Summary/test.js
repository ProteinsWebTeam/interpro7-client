import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SummaryProtein } from './index.tsx';

const renderer = new ShallowRenderer();

describe('<SummaryProtein />', () => {
  test('should render', () => {
    renderer.render(
      <SummaryProtein
        data={{
          metadata: {
            accession: 'A0A000',
            counters: {
              dbEntries: {
                cathgene3d: 2,
                cdd: 1,
                interpro: 5,
                panther: 2,
                pfam: 1,
                ssf: 1,
                tigrfams: 1,
              },
              entries: 13,
              idas: 323222,
              isoforms: 0,
              proteome: 0,
              proteomes: 0,
              sets: 3,
              similar_proteins: 323222,
              structures: 0,
              taxa: 1,
              taxonomy: 1,
            },
            description: [],
            gene: 'moeA5',
            go_terms: [
              {
                category: { code: 'F', name: 'molecular_function' },
                identifier: 'GO:0030170',
                name: 'pyridoxal phosphate binding',
              },
            ],
            id: 'A0A000_STRVD',
            ida_accession: '220d43766bfe69807874ea078bc783ea7854e968',
            is_fragment: false,
            length: 394,
            name: {
              name: 'MoeA5',
            },
            protein_evidence: 4,
            proteome: null,
            sequence:
              'MDFFVRLARETGDRKREFLELGRKAGRFPAASTSNGEISIWCSNDYLGMGQHPDVLDAMKRSVDEYGGGSGGSRNTGGTNHFHVALEREPAEPHGKEDAVLFTSGYSAN',
            source_database: 'unreviewed',
            source_organism: {
              fullName: 'Streptomyces viridosporus',
              scientificName: 'Streptomyces viridosporus',
              taxId: '67581',
            },
          },
        }}
        loading={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
