import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { partition } from 'lodash-es';

import PMCLink from 'components/ExtLink/PMCLink';
import { DOILink } from 'components/ExtLink/patternLinkWrapper';
import Link from 'components/generic/Link';

import { hashSelector } from 'reducers/custom-location/hash';
import loadable from 'higherOrder/loadable';
import { schemaProcessCitations } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import refStyles from './style.css';
import { getDescriptionText } from 'components/Description';

const css = cssBinder(refStyles, ipro);

export const getLiteratureIdsFromDescription = (
  description: Array<string | StructuredDescription>,
): Array<string> =>
  (description || []).reduce(
    (acc, part) => [
      ...acc,
      ...(getDescriptionText(part).match(/\[cite:(PUB\d+)\]/gi) || []).map(
        (t) => t.replace(/(^\[cite:)|(]$)/g, ''),
      ),
    ],
    [] as string[],
  );
export const splitCitations = (
  literature: LiteratureMetadata,
  citations: string[],
) =>
  partition(Object.entries(literature || {}), ([id]) => citations.includes(id));

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type LiteratureItemProps = {
  reference: Reference;
  i?: number;
  included?: boolean;
  target: boolean;
};
const LiteratureItem = ({
  reference: r,
  i,
  included,
  target,
}: LiteratureItemProps) => (
  <div className={css('reference', 'small', { target })}>
    <p className={css('cite')}>
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
            className={css('index')}
            to={(customLocation) => ({
              ...customLocation,
              hash: `description-${i}`,
            })}
            aria-label="jump up"
          >
            {i}.
          </Link>
        ) : (
          <span>{i}. </span>
        ))}
      <span className={css('title')}>{r.title} </span>
      <span className={css('authors')}>{r.authors.join(', ')} </span>{' '}
      {r.ISO_journal && (
        <span className={css('journal')}>{r.ISO_journal} </span>
      )}
      {r.volume && <span className={css('volume')}> {r.volume}, </span>}
      {r.raw_pages && <span className={css('pages')}> {r.raw_pages}, </span>}
      <span className={css('year')}>({r.year})</span>.{' '}
      {r.rawPages && <span className={css('pages')}>{r.rawPages}. </span>}
      {r.DOI_URL && (
        <DOILink
          id={r.DOI_URL}
          className={css('ext-link', 'margin-right-medium')}
        >
          View article
        </DOILink>
      )}
      {r.PMID && (
        <span>
          PMID:{' '}
          <PMCLink
            id={r.PMID}
            className={css('ext-link', 'margin-right-medium')}
          >
            {r.PMID}
          </PMCLink>
        </span>
      )}
    </p>
  </div>
);

type Props = {
  included?: Array<[string, Reference]>;
  extra?: Array<[string, Reference]>;
  target: string;
};
const Literature = ({ included = [], extra = [], target }: Props) => (
  <>
    {included.length ? (
      <div className={css('vf-grid')}>
        <div className={css('list', { 'single-entry': included.length === 1 })}>
          {included.map(([pubID, ref], i) => (
            <LiteratureItem
              key={pubID}
              reference={ref}
              i={i + 1}
              included
              target={target === String(pubID)}
            />
          ))}
        </div>
      </div>
    ) : null}

    {/* Only display "Further reading" if there have been main references */}
    {included.length && extra.length ? <h5>Further reading</h5> : null}
    {extra.length ? (
      <div className={css('vf-grid')}>
        <div
          className={css('list', 'further', {
            'single-entry': extra.length === 1,
          })}
        >
          {extra.map(([pubID, ref], i) => (
            <LiteratureItem
              key={pubID}
              reference={ref}
              target={target === String(pubID)}
              i={(included?.length || 0) + i + 1}
            />
          ))}
        </div>
      </div>
    ) : null}
  </>
);

const mapStateToProps = createSelector(hashSelector, (target) => ({ target }));

export default connect(mapStateToProps)(Literature);
