import React, {PropTypes as T} from 'react';

import {GoLink} from 'components/ExtLink';

import styles from 'styles/blocks.css';

const GoTerms = ({terms}/*: {terms: {[key: string]: Array<any>}} */) => (
  <div className={styles.card}>
    <h3>Gene Ontology Terms</h3>
    <ul>
      {Object.entries(terms)
        .filter(([, values]) => values.length)
        .map(([key, values]) => (
          <li key={key}>
            <h4>{key}:</h4>
            <ul>
              {values.map(({id, name}) => (
                <li key={id}>
                  <GoLink id={id}>{name} ({id})</GoLink>
                </li>
              ))}
            </ul>
          </li>
        ))
      }
    </ul>
  </div>
);
GoTerms.propTypes = {
  terms: T.object.isRequired,
};

export default GoTerms;
