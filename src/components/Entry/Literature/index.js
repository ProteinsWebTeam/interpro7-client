// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { PMCLink, DOILink } from 'components/ExtLink';
import Link from 'components/generic/Link';

import { hashSelector } from 'reducers/custom-location/hash';
import loadable from 'higherOrder/loadable';
import { schemaProcessCitations } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import refStyles from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(refStyles, ebiStyles);

export const getLiteratureIdsFromDescription = (
  description /*: Array<string> */,
) =>
  (description || []).reduce(
    (acc, part) => [
      ...acc,
      ...(part.match(/\[cite:(PUB\d+)\]/gi) || []).map((t) =>
        t.replace(/(^\[cite:)|(]$)/g, ''),
      ),
    ],
    [],
  );

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Reference = Object; */

const LiteratureItem = (
  {
    pubID,
    reference: r,
    i,
    included,
    target,
  } /*: {|
  pubID: number,
  reference: Reference,
  i?: number,
  included?: boolean,
  target: boolean,
|} */,
) => (
  <div className={f('reference', 'small', { target })}>
    <p className={f('cite')}>
      <SchemaOrgData
        data={{
          identifier: `http://identifiers.org/pubmed/${r.PMID}`,
          author: r.authors,
          name: r.title,
        }}
        processData={schemaProcessCitations}
      />
      {typeof i !== 'undefined' &&
        (included ? (
          <Link
            id={pubID}
            className={f('index')}
            to={(customLocation) => ({
              ...customLocation,
              hash: `description-${i}`,
            })}
            aria-label="jump up"
          >
            {i}.^
          </Link>
        ) : (
          <span>[{i}]. </span>
        ))}
      <span className={f('title')}>{r.title} </span>
      <span className={f('authors')}>{r.authors.join(', ')} </span>{' '}
      {r.ISO_journal && <span className={f('journal')}>{r.ISO_journal} </span>}
      {r.volume && <span className={f('volume')}> {r.volume}, </span>}
      {r.raw_pages && <span className={f('pages')}> {r.raw_pages}, </span>}
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
      {r.PMID && (
        <span>
          PMID:{' '}
          <PMCLink id={r.PMID} className={f('ext', 'margin-right-medium')}>
            {r.PMID}
          </PMCLink>
        </span>
      )}
    </p>
  </div>
);
LiteratureItem.propTypes = {
  pubID: T.number.isRequired,
  reference: T.object.isRequired,
  i: T.number,
  included: T.bool,
  target: T.bool.isRequired,
};

const Literature = (
  {
    included = [],
    extra = [],
    target,
  } /*: {|
  included?: Array<[number, Reference]>,
  extra?: Array<[number, Reference]>,
  target: string
|} */,
) => (
  <div className={f('row')}>
    <div className={f('large-12', 'columns', 'margin-bottom-large')}>
      {included.length ? (
        <div className={f('list', { 'single-entry': included.length === 1 })}>
          {included.map(([pubID, ref], i) => (
            <LiteratureItem
              pubID={pubID}
              key={pubID}
              reference={ref}
              i={i + 1}
              included
              target={target === pubID}
            />
          ))}
        </div>
      ) : null}
      {/* Only display "Further reading" if there have been main references */}
      {included.length && extra.length ? <h5>Further reading</h5> : null}
      {extra.length ? (
        <div
          className={f('list', 'further', {
            'single-entry': extra.length === 1,
          })}
        >
          {extra.map(([pubID, ref], i) => (
            <LiteratureItem
              pubID={pubID}
              key={pubID}
              reference={ref}
              target={target === pubID}
              i={(included?.length || 0) + i + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  </div>
);
Literature.propTypes = {
  included: T.arrayOf(T.array),
  extra: T.arrayOf(T.array),
  target: T.string.isRequired,
};

const mapStateToProps = createSelector(hashSelector, (target) => ({ target }));

export default connect(mapStateToProps)(Literature);
