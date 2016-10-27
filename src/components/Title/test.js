/* eslint-env node */
/* eslint-env mocha */
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import {Link} from 'react-router';

import Title, {Time, InterproSymbol} from '.';
import {
  OriginDB, SourceOrganism, Name,
} from 'components/SimpleCommonComponents';

import styles from 'styles/blocks.css';
import ipro from 'styles/interpro-new.css';

chai.use(jsxChai);
const renderer = createRenderer();

describe('<Title />', () => {
  describe('For an entry', () => {
    it('should render a title component correctly', () => {
      renderer.render(
        <Title pathname="/entry/pathname/" metadata={{
          name: {
            name: 'Piwi domain',
          },
          type: 'domain',
          accession: 'PF02171',
          source_database: 'pfam',
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div>
          <InterproSymbol type="domain"/>
          <h3>Piwi domain <small>(PF02171)</small></h3>
          <div className={ipro['md-hlight']}>
            <h5>Member database:&nbsp;
              <Link to="/entry/pfam/">
                pfam
              </Link>
            </h5>
          </div>
        </div>
      );
    });
  });
  describe.skip('For a protein', () => {
    it('should render a title component correctly', () => {
      renderer.render(
        <Title pathname="/some/pathname/" metadata={{
          name: {
            name: 'Carboxypeptidase Y homolog A',
          },
          accession: 'A1CUJ5',
          source_database: 'swissprot',
          gene: 'cpyA',
          source_organism: {
            name: 'Aspergillus clavatus',
            taxid: 344612,
          },
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div className={styles.card}>
          <h2>Carboxypeptidase Y homolog A</h2>
          <div>
            <Name
              name={{name: 'Carboxypeptidase Y homolog A'}}
              accession="A1CUJ5"
            />
            <OriginDB
              source="swissprot"
              pathname="/some/pathname/"
              accession="A1CUJ5"
            />
            <p>Gene: cpyA</p>
            <SourceOrganism name="Aspergillus clavatus" taxid={344612} />
          </div>
        </div>
      );
    });
  });
  describe.skip('For a structure', () => {
    it('should render a title component correctly', () => {
      renderer.render(
        <Title pathname="/some/pathname/1JM7/" metadata={{
          name: {
            name: 'RING-domain heterodimer',
          },
          accession: '1JM7',
          source_database: 'pdb',
          experiment_type: 'Solution NMR',
          release_date: '2009-02-24',
          chains: ['A', 'B'],
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div className={styles.card}>
          <h2>RING-domain heterodimer</h2>
          <div>
            <Name name={{name: 'RING-domain heterodimer'}} accession="1JM7" />
            <OriginDB
              source="pdb"
              pathname="/some/pathname/1JM7/"
              accession="1JM7"
            />
            <p>Experiment Type: Solution NMR</p>
            <p>Release Date: <Time date="2009-02-24" /></p>
            <ul>Chains:
              <li><Link to="/some/pathname/1JM7/A/">Chain A</Link></li>
              <li><Link to="/some/pathname/1JM7/B/">Chain B</Link></li>
            </ul>
          </div>
        </div>
      );
    });
  });
});
