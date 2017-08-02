// @flow
import React from 'react';
import T from 'prop-types';
import partition from 'lodash-es/partition';

import { PMCLink, DOILink } from 'components/ExtLink';
import AnimatedEntry from 'components/AnimatedEntry';

import { createAsyncComponent } from 'utilityComponents/AsyncComponent';

import refStyles from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import { foundationPartial } from 'styles/foundation';
const f = foundationPartial(refStyles, ebiStyles);
// TODO: check the "partial" binding.
// The partial binding is not cascading the styles,
// in this case is taking row from ebi.css but is not
// using the foundation that has been defined

// import {buildAnchorLink} from 'utils/url';

const SchemaOrgData = createAsyncComponent(
  () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  () => null,
  'SchemaOrgData',
);

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
      ...(part.match(/"(PUB\d+)"/gi) || [])
        .map(t => t.replace(/(^")|("$)/g, '')),
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
) =>
  <li className={f('reference', 'small')} id={included ? pubID : null}>
    <SchemaOrgData data={r} processData={schemaProcessData} />
    {included &&
      <span className={f('index')}>
        [{i}]
      </span>}
    <span className={f('authors')}>{r.authors}</span>
    <span className={f('year')}>({r.year})</span>.
    <span className={f('title')}>{r.title}</span>
    {r.ISOJournal &&
      <span className={f('journal')}>
        {r.ISOJournal},{' '}
      </span>}
    {r.issue &&
      <span className={f('issue')}>
        {r.issue},{' '}
      </span>}
    {r.rawPages &&
      <span className={f('pages')}>
        {r.rawPages}.{' '}
      </span>}
    <span className={f('reference_id')}>{pubID}.</span>
    {r.DOI_URL && <DOILink id={r.DOI_URL}>DOI</DOILink>}
    {r.DOI_URL && <span>|</span>}
    <PMCLink id={r.PMID}>EuropePMC</PMCLink>
  </li>;
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
      <div className={f('large-12', 'columns')}>
        {included.length
          ? <AnimatedEntry className={f('list')} itemDelay={100} duration={500}>
              <h5>Used in this entry</h5>
              {included.map(([pubID, ref], i) =>
                <LiteratureItem
                  pubID={pubID}
                  key={pubID}
                  reference={ref}
                  i={i + 1}
                  included
                />,
              )}
            </AnimatedEntry>
          : null}
        {extra.length
          ? <AnimatedEntry className={f('list')} itemDelay={100} duration={500}>
              <h5>Further reading</h5>
              {extra.map(([pubID, ref]) =>
                <LiteratureItem pubID={pubID} key={pubID} reference={ref} />,
              )}
            </AnimatedEntry>
          : null}
      </div>
    </div>
  );
};
Literature.propTypes = {
  references: T.objectOf(T.object.isRequired).isRequired,
  description: T.arrayOf(T.string),
};

export default Literature;
