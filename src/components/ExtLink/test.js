/* eslint-env node */
/* eslint-env mocha */
/* eslint react/jsx-key: 0 */
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import {
  BaseLink, TaxLink, PMCLink, DOILink, GoLink, PDBeLink, UniProtLink,
} from '.';

chai.use(jsxChai);
const renderer = createRenderer();

describe('External links', () => {
  describe('<BaseLink />', () => {
    it('should render simple links', () => {
      const examples = new Set([
        {
          pattern: 'http://www.example.com/{id}',
          id: 'some_id',
          expected: 'http://www.example.com/some_id',
        },
        {
          pattern: 'https://example.com/{id}/something',
          id: 999,
          expected: 'https://example.com/999/something',
        },
        {
          pattern: 'example.com/id:{id}',
          id: 'Identification',
          expected: 'example.com/id:Identification',
        },
      ]);
      const children = new Set([
        <div>link</div>,
        <div>div<span>span</span></div>,
        'link',
      ]);

      for (const {pattern, id, expected} of examples) {
        for (const child of children) {
          renderer.render(
            <BaseLink id={id} pattern={pattern} target="_blank">
              {child}
            </BaseLink>
          );
          expect(renderer.getRenderOutput()).to.deep.equal(
            <a href={expected} target="_blank">
              {child}
            </a>
          );
        }
      }
    });
  });

  describe('<TaxLink />', () => {
    it('should render simple links', () => {
      renderer.render(
        <TaxLink id={12345} />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <BaseLink
          id={12345}
          pattern="https://www.ebi.ac.uk/ena/data/view/Taxon:{id}"
          target="_blank"
        >
          TaxID 12345
        </BaseLink>
      );
    });
  });

  describe('<PMCLink />', () => {
    it('should render simple links', () => {
      renderer.render(
        <PMCLink id={12345} />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <BaseLink
          id={12345}
          pattern="https://europepmc.org/abstract/MED/{id}"
          target="_blank"
        >
          PUB12345
        </BaseLink>
      );
    });
  });

  describe('<DOILink />', () => {
    it('should render simple links', () => {
      renderer.render(
        <DOILink id="1.2.a.b" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <BaseLink
          id="1.2.a.b"
          pattern="{id}"
          target="_blank"
        >
          1.2.a.b
        </BaseLink>
      );
    });
  });

  describe('<GoLink />', () => {
    it('should render simple links', () => {
      const pattern = (
        'http://www.ebi.ac.uk/ols/beta/ontologies/go/terms?iri=' +
        'http://purl.obolibrary.org/obo/{id}'
      );
      const expected = (
        <BaseLink
          id="GO_0003676"
          pattern={pattern}
          target="_blank"
        >
          GO:0003676
        </BaseLink>
      );
      for (const id of ['GO_0003676', 'GO:0003676']) {
        renderer.render(
          <GoLink id={id} />
        );
        expect(renderer.getRenderOutput()).to.deep.equal(expected);
      }
    });
  });

  describe('<PDBeLink />', () => {
    it('should render simple links', () => {
      const expected = (
        <BaseLink
          id="101m"
          pattern="https://www.ebi.ac.uk/pdbe/entry/pdb/{id}"
          target="_blank"
        >
          101m
        </BaseLink>
      );
      renderer.render(
        <PDBeLink id="101m" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(expected);
    });
  });

  describe('<UniProtLink />', () => {
    it('should render simple links', () => {
      const expected = (
        <BaseLink
          id="A0A023GPI8"
          pattern="http://www.uniprot.org/uniprot/{id}"
          target="_blank"
        >
          A0A023GPI8
        </BaseLink>
      );
      renderer.render(
        <UniProtLink id="A0A023GPI8" />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(expected);
    });
  });
});
