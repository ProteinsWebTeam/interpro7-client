import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import PMCLink from 'components/ExtLink/PMCLink';
import { DOILink } from 'components/ExtLink/patternLinkWrapper';
import Link from 'components/generic/Link';

import { hashSelector } from 'reducers/custom-location/hash';
import loadable from 'higherOrder/loadable';
import { schemaProcessCitations } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import refStyles from './style.css';

const css = cssBinder(refStyles);

export const getLiteratureIdsFromDescription = (
  description: Array<string>
): Array<string> =>
  (description || []).reduce(
    (acc, part) => [
      ...acc,
      ...(part.match(/\[cite:(PUB\d+)\]/gi) || []).map((t) =>
        t.replace(/(^\[cite:)|(]$)/g, '')
      ),
    ],
    []
  );

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type LiteratureItemProps = {
  pubID: number;
  reference: Reference;
  i?: number;
  included?: boolean;
  target: boolean;
};
const LiteratureItem = ({
  // pubID,
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
            // id={pubID}
            className={css('index')}
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
      <span className={css('title')}>{r.title} </span>
      <span className={css('authors')}>{r.authors.join(', ')} </span>{' '}
      {r.ISO_journal && (
        <span className={css('journal')}>{r.ISO_journal} </span>
      )}
      {r.volume && <span className={css('volume')}> {r.volume}, </span>}
      {r.raw_pages && <span className={css('pages')}> {r.raw_pages}, </span>}
      <span className={css('year')}>({r.year})</span>.{' '}
      {r.rawPages && <span className={css('pages')}>{r.rawPages}. </span>}
      {
        // not used anywhere on Europe PMC website not even to link to PMCID:PMC
        // <span className={f('reference_id')}>{pubID}.</span>
      }
      {r.DOI_URL && (
        <DOILink id={r.DOI_URL} className={css('ext', 'margin-right-medium')}>
          View article
        </DOILink>
      )}
      {r.PMID && (
        <span>
          PMID:{' '}
          <PMCLink id={r.PMID} className={css('ext', 'margin-right-medium')}>
            {r.PMID}
          </PMCLink>
        </span>
      )}
    </p>
  </div>
);

type Props = {
  included?: Array<[number, Reference]>;
  extra?: Array<[number, Reference]>;
  target: string;
};
const Literature = ({ included = [], extra = [], target }: Props) => (
  <div className={css('vf-grid')}>
    {included.length ? (
      <div className={css('list', { 'single-entry': included.length === 1 })}>
        {included.map(([pubID, ref], i) => (
          <LiteratureItem
            pubID={pubID}
            key={pubID}
            reference={ref}
            i={i + 1}
            included
            target={target === String(pubID)}
          />
        ))}
      </div>
    ) : null}
    {/* Only display "Further reading" if there have been main references */}
    {included.length && extra.length ? <h5>Further reading</h5> : null}
    {extra.length ? (
      <div
        className={css('list', 'further', {
          'single-entry': extra.length === 1,
        })}
      >
        {extra.map(([pubID, ref], i) => (
          <LiteratureItem
            pubID={pubID}
            key={pubID}
            reference={ref}
            target={target === String(pubID)}
            i={(included?.length || 0) + i + 1}
          />
        ))}
      </div>
    ) : null}
  </div>
);

const mapStateToProps = createSelector(hashSelector, (target) => ({ target }));

export default connect(mapStateToProps)(Literature);
