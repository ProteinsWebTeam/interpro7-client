/* eslint-env node */
/* eslint-env mocha */
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import GoTerms from '.';
import {GoLink} from 'components/ExtLink';

import styles from 'styles/blocks.css';

chai.use(jsxChai);
const renderer = createRenderer();

describe.skip('External links', () => {
  describe('<GoTerms />', () => {
    it('should render GoTerms component', () => {
      renderer.render(
        <GoTerms terms={{
          molecular_function: [
            {name: 'serine-type carboxypeptidase activity', id: 'GO:0004185'},
          ],
          cellular_component: [
            {name: 'vacuole', id: 'GO:0005773'},
          ],
          biological_process: [
            {name: 'proteolysis', id: 'GO:0006508'},
          ],
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div className={styles.card}>
          <h3>Gene Ontology Terms</h3>
          <ul>
            <li key="molecular_function">
              <h4>molecular_function:</h4>
              <ul>
                <li><GoLink id="GO:0004185">
                  serine-type carboxypeptidase activity (GO:0004185)
                </GoLink></li>
              </ul>
            </li>
            <li key="cellular_component">
              <h4>cellular_component:</h4>
              <ul>
                <li><GoLink id="GO:0005773">
                  vacuole (GO:0005773)
                </GoLink></li>
              </ul>
            </li>
            <li key="biological_process">
              <h4>biological_process:</h4>
              <ul>
                <li><GoLink id="GO:0006508">
                  proteolysis (GO:0006508)
                </GoLink></li>
              </ul>
            </li>
          </ul>
        </div>
      );
    });

    it('should render GOTerms component with only the defined subset', () => {
      renderer.render(
        <GoTerms terms={{
          molecular_function: [
            {name: 'nucleic acid binding', id: 'GO:0003676'},
          ],
          cellular_component: [],
          biological_process: [
            {name: 'nucleic acid binding', id: 'GO:0003676'},
          ],
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div className={styles.card}>
          <h3>Gene Ontology Terms</h3>
          <ul>
            <li key="molecular_function">
              <h4>molecular_function:</h4>
              <ul>
                <li><GoLink id="GO:0003676">
                  nucleic acid binding (GO:0003676)
                </GoLink></li>
              </ul>
            </li>
            <li key="biological_process">
              <h4>biological_process:</h4>
              <ul>
                <li><GoLink id="GO:0003676">
                  nucleic acid binding (GO:0003676)
                </GoLink></li>
              </ul>
            </li>
          </ul>
        </div>
      );
      renderer.render(
        <GoTerms terms={{
          molecular_function: [],
          cellular_component: [],
          biological_process: [],
        }}
        />
      );
      expect(renderer.getRenderOutput()).to.deep.equal(
        <div className={styles.card}>
          <h3>Gene Ontology Terms</h3>
          <ul />
        </div>
      );
    });
  });
});
