/* eslint-env node */
/* eslint-env mocha */
/* eslint no-magic-numbers: [1, {ignore: [12345]}]*/
import 'babel-polyfill';

import React, {createElement} from 'react';
import {createRenderer} from 'react-dom/test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import Link from 'components/generic/Link';

import {Name, ExtOriginDB, OriginDB, SourceOrganism} from '.';
import {TaxLink, PDBeLink, UniProtLink} from 'components/ExtLink';

chai.use(jsxChai);
const renderer = createRenderer();

describe('Simple Common Components', () => {
  describe('<Name />', () => {
    it('should render name information', () => {
      renderer.render(
        <Name name={{name: 'name', short: 'short'}} accession="accession" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div>
          <h3>name (accession)</h3>
          <p style={{color: 'gray'}}>Short name: short</p>
        </div>
      );
      renderer.render(
        <Name name={{name: 'name'}} accession="accession" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div>
          <h3>name (accession)</h3>
        </div>
      );
    });
  });

  describe('<ExtOriginDB />', () => {
    it('should render external origin database link', () => {
      const sourceComponentTuples = [
        ['pdb', PDBeLink, 'PDBe'],
        ['PDB', PDBeLink, 'PDBe'],
        ['swissprot', UniProtLink, 'SwissProt'],
        ['SwissProt', UniProtLink, 'SwissProt'],
        ['trembl', UniProtLink, 'TrEMBL'],
        ['TrEMBL', UniProtLink, 'TrEMBL'],
      ];
      for (const accession of ['accession', 12345]) {
        for (const [source, component, nicerName] of sourceComponentTuples) {
          renderer.render(
            <ExtOriginDB source={source} accession={accession} />
          );
          expect(renderer.getRenderOutput()).to.deep.equal(
            createElement(
              component,
              {id: accession},
              [`(${nicerName} external link)`]
            )
          );
        }
      }
    });

    it('should render nothing if not an external database', () => {
      for (const notExternalDB of ['InterPro', 'interpro', 'randomString']) {
        renderer.render(<ExtOriginDB source={notExternalDB} accession={''} />);
        expect(renderer.getRenderOutput()).to.deep.equal(null);
      }
    });
  });

  describe.skip('<OriginDB />', () => {
    it('should render origin database information', () => {
      const fixtureTuples = [
        ['protein', 'trembl', 'A0JUS0'],
        ['entry', 'interpro', 'IPR000001'],
        ['structure', 'pdb', '9xim'],
      ];
      for (const [type, db, accession] of fixtureTuples) {
        renderer.render(
          <OriginDB
            source={db}
            pathname={`/${type}/${db}/${accession}/`}
            accession={accession}
          />
        );
        expect(renderer.getRenderOutput()).to.deep.equal(
          <p>
            Source DB:{' '}
            <Link
              newTo={{description: {mainType: type, mainDB: db}}}
            >
              {db}
            </Link> <ExtOriginDB source={db} accession={accession} />
          </p>
        );
      }
    });
  });

  describe('<SourceOrganism />', () => {
    it('should render source organism information', () => {
      renderer.render(
        <SourceOrganism taxid={12345} name="organism name" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <p>
          Source Organism:
          <TaxLink id={12345}>organism name (12345)</TaxLink>
        </p>
      );
    });
  });
});
