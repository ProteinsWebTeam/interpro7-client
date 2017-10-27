// @flow
/* eslint react/jsx-key: 0 */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { BaseLink, PMCLink, DOILink, GoLink, PDBeLink, UniProtLink } from '.';

const renderer = new ShallowRenderer();

describe('External links', () => {
  describe.skip('<BaseLink />', () => {
    test('should render simple links', () => {
      const examples = new Set([
        {
          pattern: 'http://www.example.com/{id}',
          id: 'some_id',
        },
        {
          pattern: 'https://example.com/{id}/something',
          id: 999,
        },
        {
          pattern: 'example.com/id:{id}',
          id: 'Identification',
        },
      ]);
      const children = new Set([
        <div>link</div>,
        <div>
          div<span>span</span>
        </div>,
        'link',
      ]);

      for (const { pattern, id } of examples) {
        for (const child of children) {
          renderer.render(
            <BaseLink id={id} pattern={pattern} target="_blank">
              {child}
            </BaseLink>,
          );
          expect(renderer.getRenderOutput()).toMatchSnapshot();
        }
      }
    });
  });

  describe('<PMCLink />', () => {
    test('should render simple links', () => {
      renderer.render(<PMCLink id={12345} />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('<DOILink />', () => {
    test('should render simple links', () => {
      renderer.render(<DOILink id="1.2.a.b" />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('<GoLink />', () => {
    test('should render simple links', () => {
      for (const id of ['GO_0003676', 'GO:0003676']) {
        renderer.render(<GoLink id={id} />);
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      }
    });
  });

  describe('<PDBeLink />', () => {
    test('should render simple links', () => {
      renderer.render(<PDBeLink id="101m" />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('<UniProtLink />', () => {
    test('should render simple links', () => {
      renderer.render(<UniProtLink id="A0A023GPI8" />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
