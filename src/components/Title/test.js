/* eslint-env node */
/* eslint-env mocha */
import 'babel-polyfill';

import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import Link from 'components/Link';

import Title, {InterproSymbol} from '.';

import ipro from 'styles/interpro-new.css';

chai.use(jsxChai);
const renderer = createRenderer();

describe.skip('<Title />', () => {
  describe('For an entry', () => {
    it('should render a title component correctly', () => {
      renderer.render(
        <Title
          pathname="/entry/pathname/"
          metadata={{
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
          <div className="my-svg-container">
            <InterproSymbol type="domain"/>
          </div>
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
  describe('For a protein', () => {
    it('should render a title component correctly', () => {
      renderer.render(
        <Title
          pathname="/some/pathname/"
          metadata={{
            length: 462,
            description:  ["Created on Monday 13 August 2007 by user 'UJJWAL'"],
            name: {
              other: [],
              name: 'VATB_METVS',
              short: '',
            },
            gene: '',
            id: 'VATB_METVS',
            accession: 'A6UP55',
          }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div>
          <h3>
            VATB_METVS
            <small>(A6UP55)</small>
          </h3>
        </div>
      );
    });
  });
  describe('For a structure', () => {
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
        <div>
          <h3>RING-domain heterodimer
            <small>(1JM7)</small>
          </h3>
        </div>
      );
    });
  });
});
