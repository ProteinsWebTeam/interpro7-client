import React, {PropTypes as T} from 'react';

import {GoLink} from 'components/ExtLink';

import ebiStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import {foundationPartial} from 'styles/foundation';
const f = foundationPartial(ebiStyles, ipro);

const GoTerms = ({terms}/*: {terms: {[key: string]: Array<any>}} */) => (
  <section id="go-terms">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <h4>Go terms</h4>
      </div>
    </div>
    <div className={f('row')}>
        {Object.entries(terms)
          .map(([key, values]) => (
            <div key={key} className={f('medium-6', 'large-4', 'columns')}>
              <h5 style={{textTransform: 'capitalize'}}>
                {key.replace('_', ' ')}
              </h5>
              <ul className={f('no-bullet')}>
                { values && values.length > 1 ?
                  values.map(({id, name}) => (
                    <li key={id}>
                      <GoLink
                        id={id}
                        className={f('label', 'go', key)}
                      >{name} ({id})</GoLink>
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
  </section>
);
GoTerms.propTypes = {
  terms: T.object.isRequired,
};

export default GoTerms;
