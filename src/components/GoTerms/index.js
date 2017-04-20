/* eslint no-magic-numbers: [1, {ignore: [1, 10, 15, 30, 100]}] */
import React, {PropTypes as T} from 'react';

import {GoLink} from 'components/ExtLink';

import ebiStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import {foundationPartial} from 'styles/foundation';
const f = foundationPartial(ebiStyles, ipro);

const getDefaultPayload = () => ({
  biological_process: [],
  molecular_function: [],
  cellular_component: [],
});

export const GoTermsByCategory = ({terms}) => {
  // TODO: change when GO terms are correct in the API
  const _terms = terms.reduce((acc, term) => {
    // eslint-disable-next-line no-param-reassign
    if (!acc[term.category]) acc[term.category] = [];
    if (typeof term === 'string') {
      acc[term.category].push({identifier: term});
      return acc;
    }
    acc[term.category].push(term);
    return acc;
  }, getDefaultPayload());
  console.log(_terms);
  return (
    <div className={f('row')}>
      {Object.entries(_terms)
        .map(([key, values]) => (
          <div key={key} className={f('medium-6', 'large-4', 'columns')}>
            <h5 style={{textTransform: 'capitalize'}}>
              {key.replace('_', ' ')}
            </h5>
            <ul className={f('no-bullet')}>
              { values && values.length ?
                values.map(({identifier, name}) => (
                  <li key={identifier}>
                    <GoLink
                      id={identifier}
                      className={f('label', 'go', key)}
                      title={identifier}
                    >{name || identifier}</GoLink>
                  </li>
                )) :
                <li>
                  <span className={f('secondary', 'label')}>None</span>
                </li>
              }
            </ul>
          </div>
        ))
      }
    </div>
  );
};
GoTermsByCategory.propTypes = {
  terms: T.arrayOf(T.object.isRequired).isRequired,
};

const GoTerms = ({terms}/*: {terms: Array<object>} */) => (
  <section id="go-terms">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <h4>Go terms</h4>
      </div>
    </div>
    <GoTermsByCategory terms={terms}/>
  </section>
);
GoTerms.propTypes = {
  terms: T.arrayOf(T.object.isRequired).isRequired,
};

export default GoTerms;
