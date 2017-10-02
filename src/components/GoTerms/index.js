import React from 'react';
import T from 'prop-types';

import { GoLink } from 'components/ExtLink';
import AnimatedEntry from 'components/AnimatedEntry';

import loadable from 'higherOrder/loadable';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import local from './style.css';
import { foundationPartial } from 'styles/foundation';
const f = foundationPartial(ebiStyles, ipro, local);

const getDefaultPayload = () => ({
  'Biological Process': [],
  'Molecular Function': [],
  'Cellular Component': [],
});

const mapNameToClass = new Map([
  ['Biological Process', 'go-title-bp'],
  ['Molecular Function', 'go-title-mf'],
  ['Cellular Component', 'go-title-cc'],
]);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': 'Record',
  '@id': '@seeAlso',
  identifier: data,
});

const GoTerms = ({ terms } /*: {terms: Array<Object>} */) => {
  const _terms = terms.reduce((acc, term) => {
    // eslint-disable-next-line no-param-reassign
    if (!acc[term.category]) acc[term.category] = [];
    if (typeof term === 'string') {
      acc[term.category].push({ identifier: term });
      return acc;
    }
    acc[term.category].push(term);
    return acc;
  }, getDefaultPayload());
  return (
    <section>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h4>Go terms</h4>
        </div>
      </div>
      <div className={f('row')}>
        {Object.entries(_terms).map(([key, values]) => (
          <div
            key={key}
            className={f(
              'small-12',
              'medium-4',
              'columns',
              'margin-bottom-large',
            )}
          >
            <p className={f(mapNameToClass.get(key))}>{key}</p>
            <ul className={f('go-list')}>
              {values && values.length ? (
                values.map(({ identifier, name }) => (
                  <li key={identifier}>
                    <SchemaOrgData
                      data={identifier}
                      processData={schemaProcessData}
                    />
                    <GoLink
                      id={identifier}
                      className={f('go-terms')}
                      title={`${name} (${identifier})`}
                    >
                      {name || identifier}
                    </GoLink>
                  </li>
                ))
              ) : (
                <li>
                  <span style={{ fontSize: '0.9rem' }}>None</span>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
GoTerms.propTypes = {
  terms: T.arrayOf(T.object.isRequired).isRequired,
};

export default GoTerms;
