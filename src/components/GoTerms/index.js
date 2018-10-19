import React from 'react';
import T from 'prop-types';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { GoLink } from 'components/ExtLink';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ebiStyles, ipro, local);

const getDefaultPayload = () => ({
  biological_process: [],
  molecular_function: [],
  cellular_component: [],
});

const mapNameToClass = new Map([
  ['biological_process', 'bp'],
  ['molecular_function', 'mf'],
  ['cellular_component', 'cc'],
]);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@seeAlso',
  identifier: data,
});

const GoTerms = (
  { terms, type, db } /*: {terms: Array<Object>, type: string, db?: string} */,
) => {
  // remove duplicates
  // TODO: remove duplicates from data, then remove this as will be unnecessary
  let _terms = new Map(terms.map(term => [term.identifier, term]));
  _terms = Array.from(_terms.values()).reduce((acc, term) => {
    if (term.category_name) {
      // eslint-disable-next-line no-param-reassign
      term.category = {
        name: term.category_name,
        code: term.category_code,
      };
    }
    // eslint-disable-next-line no-param-reassign
    if (!acc[term.category.name]) acc[term.category.name] = [];
    // if (typeof term === 'string') {
    //   acc[term.category].push({ identifier: term });
    //   return acc;
    // }
    acc[term.category.name].push(term);
    return acc;
  }, getDefaultPayload());
  let title = 'GO terms, ';
  if (type === 'entry') {
    if (db.toLowerCase() === 'interpro') {
      title += 'annotated by InterPro curators';
    } else {
      title += `as provided by ${db}`;
    }
  } else {
    title += 'as provided by the InterPro2GO pipeline';
  }
  const goTermEntries = Object.entries(_terms);
  const none = goTermEntries.every(([, category]) => !category.length);
  return (
    <section className={f('margin-top-large')}>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <Tooltip title={title}>
            <h4 className={f('title')}>GO terms</h4>
          </Tooltip>
        </div>
      </div>
      <div className={f('row')}>
        {none ? (
          <p className={f('columns')}>No GO Terms</p>
        ) : (
          goTermEntries.map(([key, values]) => (
            <div
              key={key}
              className={f(
                'small-12',
                'medium-4',
                'columns',
                'margin-bottom-large',
              )}
            >
              <p className={f(mapNameToClass.get(key), 'go-title')}>
                {key.replace('_', ' ')}
              </p>
              <ul className={f('go-list')}>
                {values && values.length ? (
                  values.map(({ identifier, name }) => (
                    <li key={identifier}>
                      <SchemaOrgData
                        data={identifier}
                        processData={schemaProcessData}
                      />

                      <GoLink id={identifier} className={f('go-terms', 'ext')}>
                        {name} ({identifier})
                      </GoLink>
                    </li>
                  ))
                ) : (
                  <li className={f('no-goterm')}>None</li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
GoTerms.propTypes = {
  terms: T.arrayOf(T.object.isRequired).isRequired,
  type: T.string.isRequired,
  db: T.string,
};

export default GoTerms;
