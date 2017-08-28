// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Name, ExtOriginDB, OriginDB, SourceOrganism } from '.';

const renderer = new ShallowRenderer();

describe('Simple Common Components', () => {
  const exampleTaxID = 12345;

  describe('<Name />', () => {
    test('should render name information', () => {
      renderer.render(
        <Name name={{ name: 'name', short: 'short' }} accession="accession" />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
      renderer.render(<Name name={{ name: 'name' }} accession="accession" />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('<ExtOriginDB />', () => {
    test('should render external origin database link', () => {
      const sourceComponentTuples = [
        'pdb',
        'PDB',
        'swissprot',
        'SwissProt',
        'trembl',
        'TrEMBL',
      ];
      for (const accession of ['accession', exampleTaxID]) {
        for (const [source] of sourceComponentTuples) {
          renderer.render(
            <ExtOriginDB source={source} accession={accession} />,
          );
          expect(renderer.getRenderOutput()).toMatchSnapshot();
        }
      }
    });

    test('should render nothing if not an external database', () => {
      for (const notExternalDB of ['InterPro', 'interpro', 'randomString']) {
        renderer.render(<ExtOriginDB source={notExternalDB} accession={''} />);
        expect(renderer.getRenderOutput()).toEqual(null);
      }
    });
  });

  describe.skip('<OriginDB />', () => {
    test('should render origin database information', () => {
      const fixtureTuples = [
        ['protein', 'unreviewed', 'A0JUS0'],
        ['entry', 'interpro', 'IPR000001'],
        ['structure', 'pdb', '9xim'],
      ];
      for (const [type, db, accession] of fixtureTuples) {
        renderer.render(
          <OriginDB
            source={db}
            pathname={`/${type}/${db}/${accession}/`}
            accession={accession}
          />,
        );
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      }
    });
  });

  describe('<SourceOrganism />', () => {
    test('should render source organism information', () => {
      renderer.render(
        <SourceOrganism taxid={exampleTaxID} name="organism name" />,
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
