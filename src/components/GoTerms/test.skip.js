/* eslint-env node */
/* eslint-env mocha */
import 'babel-polyfill';

import React from 'react';
import { createRenderer } from 'react-dom/test-utils';
import chai, { expect } from 'chai';
import jsxChai from 'jsx-chai';

import GoTerms from '.';
import { GoLink } from 'components/ExtLink';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import { foundationPartial } from 'styles/foundation';
const f = foundationPartial(ebiStyles, ipro);

chai.use(jsxChai);
const renderer = createRenderer();

describe('External links', () => {
  describe('<GoTerms />', () => {
    it('should render GoTerms component', () => {
      renderer.render(
        <GoTerms
          terms={{
            cellular_component: [],
            biological_process: [
              { id: 'GO:0004930', name: 'test1' },
              { id: 'GO:0007186', name: 'test2' },
              { id: 'GO:0016021', name: 'test3' },
            ],
            molecular_function: [],
          }}
        />,
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <section id="go-terms">
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <h4>Go terms</h4>
            </div>
          </div>
          <div className={f('row')}>
            <div
              key="cellular_component"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                cellular component
              </h5>
              <ul className={f('no-bullet')}>
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              </ul>
            </div>
            <div
              key="biological_process"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                biological process
              </h5>
              <ul className={f('no-bullet')}>
                <li key="GO:0004930">
                  <GoLink
                    id="GO:0004930"
                    className={f('label', 'go', 'biological_process')}
                  >
                    test1 (GO:0004930)
                  </GoLink>
                </li>
                <li key="GO:0007186">
                  <GoLink
                    id="GO:0007186"
                    className={f('label', 'go', 'biological_process')}
                  >
                    test2 (GO:0007186)
                  </GoLink>
                </li>
                <li key="GO:0016021">
                  <GoLink
                    id="GO:0016021"
                    className={f('label', 'go', 'biological_process')}
                  >
                    test3 (GO:0016021)
                  </GoLink>
                </li>
              </ul>
            </div>
            <div
              key="molecular_function"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                molecular function
              </h5>
              <ul className={f('no-bullet')}>
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              </ul>
            </div>
          </div>
        </section>,
      );
    });

    it('should render GOTerms component with empty subset', () => {
      renderer.render(
        <GoTerms
          terms={{
            cellular_component: [],
            biological_process: [],
            molecular_function: [],
          }}
        />,
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <section id="go-terms">
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <h4>Go terms</h4>
            </div>
          </div>
          <div className={f('row')}>
            <div
              key="cellular_component"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                cellular component
              </h5>
              <ul className={f('no-bullet')}>
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              </ul>
            </div>
            <div
              key="biological_process"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                biological process
              </h5>
              <ul className={f('no-bullet')}>
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              </ul>
            </div>
            <div
              key="molecular_function"
              className={f('medium-6', 'large-4', 'columns')}
            >
              <h5 style={{ textTransform: 'capitalize' }}>
                molecular function
              </h5>
              <ul className={f('no-bullet')}>
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              </ul>
            </div>
          </div>
        </section>,
      );
    });
  });
});
