// @flow
import React from 'react';
import T from 'prop-types';
import partition from 'lodash-es/partition';

import { PMCLink, DOILink } from 'components/ExtLink';
import Link from 'components/generic/Link';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import refStyles from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';

const f = foundationPartial(refStyles, ebiStyles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': 'ScholarlyArticle',
  '@id': '@citation',
  identifier: `http://identifiers.org/pubmed/${data.PMID}`,
  author: data.authors,
});

const description2IDs = description =>
  description.reduce(
    (acc, part) => [
      ...acc,
      ...(part.match(/"(PUB\d+)"/gi) || []).map(t =>
        t.replace(/(^")|("$)/g, ''),
      ),
    ],
    [],
  );

const LiteratureItem = (
  {
    pubID,
    reference: r,
    i,
    included,
  } /*: {pubID: string, reference: Object, i?: number, included?: boolean} */,
) => (
  <li className={f('reference', 'small')} id={included ? pubID : null}>
    <p className={f('cite')}>
      <SchemaOrgData data={r} processData={schemaProcessData} />
      {included &&
        typeof i !== 'undefined' && (
          <span className={f('index')}>
            <Link href={`#${i}`} aria-label="jump up">
              {i}.^
            </Link>{' '}
          </span>
        )}
      <span className={f('authors')}>{r.authors}</span>{' '}
      <span className={f('title')}>{r.title}</span>
      {r.ISOJournal && <span className={f('journal')}>{r.ISOJournal}, </span>}
      {r.issue && <span className={f('issue')}> {r.issue}, </span>}
      <span className={f('year')}>({r.year})</span>.{' '}
      {r.rawPages && <span className={f('pages')}>{r.rawPages}. </span>}
      {
        // not used anywhere on Europe PMC website not even to link to PMCID:PMC
        // <span className={f('reference_id')}>{pubID}.</span>
      }
      {r.DOI_URL && (
        <DOILink id={r.DOI_URL} className={f('ext', 'margin-right-medium')}>
          View article
        </DOILink>
      )}
      PMID:{' '}
      <PMCLink id={r.PMID} className={f('ext', 'margin-right-medium')}>
        {r.PMID}
      </PMCLink>
    </p>
  </li>
);
LiteratureItem.propTypes = {
  pubID: T.string.isRequired,
  reference: T.object.isRequired,
  i: T.number,
  included: T.bool,
};

const Literature = (
  {
    references,
    description,
  } /*: {|references: Object, description: Array<string>|} */,
) => {
  const citations = description2IDs(description);
  const [included, extra] = partition(Object.entries(references), ([id]) =>
    citations.includes(id),
  );
  return (
    <div className={f('row')}>
      <div className={f('large-12', 'columns', 'margin-bottom-large')}>
        {included.length ? (
          <div className={f('list')}>
            {included.map(([pubID, ref], i) => (
              <LiteratureItem
                pubID={pubID}
                key={pubID}
                reference={ref}
                i={i + 1}
                included
              />
            ))}
          </div>
        ) : null}
        {extra.length ? <h5>Further reading</h5> : null}
        {extra.length ? (
          <div className={f('list', 'further')}>
            {extra.map(([pubID, ref]) => (
              <LiteratureItem pubID={pubID} key={pubID} reference={ref} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
Literature.propTypes = {
  references: T.objectOf(T.object.isRequired).isRequired,
  description: T.arrayOf(T.string),
};

export default Literature;
