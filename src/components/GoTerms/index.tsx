import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import GoLink from 'components/ExtLink/GoLink';
import loadable from 'higherOrder/loadable';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);

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

const schemaProcessData = (data: string) => ({
  '@type': 'DataRecord',
  '@id': '@seeAlso',
  identifier: data,
});

type GoTermsProps = {
  terms: Array<GOTerm>;
  type: string;
  db?: string;
  withoutTitle?: boolean;
};
const GoTerms = ({ terms, type, db, withoutTitle = false }: GoTermsProps) => {
  const termsMap = new Map(terms.map((term) => [term.identifier, term]));
  const _terms = Array.from(termsMap.values()).reduce((acc, term) => {
    if (term.category_name && term.category_code) {
      // eslint-disable-next-line no-param-reassign
      term.category = {
        name: term.category_name,
        code: term.category_code,
      };
    }
    // eslint-disable-next-line no-param-reassign
    if (!acc[term.category.name]) acc[term.category.name] = [];
    acc[term.category.name].push(term);
    return acc;
  }, getDefaultPayload());
  let title = 'GO terms, ';
  let label = 'GO terms';
  if (type === 'entry' && typeof db !== 'undefined') {
    if (db.toLowerCase() === 'interpro') {
      title += 'annotated by InterPro curators';
    } else {
      title += `as provided by ${db}`;
    }
  } else {
    title += 'as provided by the InterPro2GO pipeline';
    label = `InterPro ${label}`;
  }
  const goTermEntries = Object.entries(_terms);
  const none = goTermEntries.every(([, category]) => !category.length);
  return (
    <section data-testid="go-terms">
      {!withoutTitle && (
        <div className={css('vf-stack')}>
          <Tooltip title={title}>
            <h4 className={css('title')}>{label}</h4>
          </Tooltip>
        </div>
      )}
      <div className={css('vf-stack')}>
        <div className={css('go-columns')}>
          {none ? (
            <p>No GO Terms</p>
          ) : (
            goTermEntries.map(([key, values]) => (
              <div key={key}>
                <p className={css(mapNameToClass.get(key), 'go-title')}>
                  {key.replace('_', ' ')}
                </p>
                <ul className={css('go-list')}>
                  {values && values.length ? (
                    values.map(({ identifier, name }) => (
                      <li key={identifier}>
                        <SchemaOrgData
                          data={identifier}
                          processData={schemaProcessData}
                        />

                        <GoLink
                          id={identifier}
                          className={css('go-terms', 'ext')}
                        >
                          {name} ({identifier})
                        </GoLink>
                      </li>
                    ))
                  ) : (
                    <li className={css('no-goterm')}>None</li>
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default GoTerms;
