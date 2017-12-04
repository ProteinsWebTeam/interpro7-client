import React from 'react';
import T from 'prop-types';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { GoLink } from 'components/ExtLink';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ebiStyles, ipro, local);

const getDefaultPayload = () => ({
  'Biological Process': [],
  'Molecular Function': [],
  'Cellular Component': [],
});

const mapNameToClass = new Map([
  ['Biological Process', 'bp'],
  ['Molecular Function', 'mf'],
  ['Cellular Component', 'cc'],
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
    // eslint-disable-next-line no-param-reassign
    if (!acc[term.category]) acc[term.category] = [];
    if (typeof term === 'string') {
      acc[term.category].push({ identifier: term });
      return acc;
    }
    acc[term.category].push(term);
    return acc;
  }, getDefaultPayload());
  let title = 'InterPro2GO';
  if (type === 'entry' && db.toLowerCase() !== 'interpro') {
    title = `GO terms (as provided by ${db})`;
  }
  return (
    <section>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h4 title="GO terms">{title}</h4>
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
            <p className={f(mapNameToClass.get(key), 'go-title')}>{key}</p>
            <ul className={f('go-list')}>
              {values && values.length ? (
                values.map(({ identifier, name }) => (
                  <li key={identifier}>
                    <SchemaOrgData
                      data={identifier}
                      processData={schemaProcessData}
                    />
                    <Tooltip title={`${name} (${identifier})`}>
                      <GoLink id={identifier} className={f('go-terms', 'ext')}>
                        {name || identifier}
                      </GoLink>
                    </Tooltip>
                  </li>
                ))
              ) : (
                <li className={f('no-goterm')}>None</li>
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
  type: T.string.isRequired,
  db: T.string,
};

export default GoTerms;
