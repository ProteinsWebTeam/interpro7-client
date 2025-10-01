import React, { ReactNode } from 'react';
import T from 'prop-types';
// $FlowFixMe
import { customLocationSelector } from 'reducers/custom-location';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';
import config from 'config';

import cssBinder from 'styles/cssBinder';
const css = cssBinder(fonts, styles);

type OnlyLocationProps = {
  location: InterProDescription;
};

type BreadCrumbProps = {
  to?: InterProPartialLocation;
  children: ReactNode;
};

const BreadCrumb = ({ to, children }: BreadCrumbProps) => {
  const childrenToPass =
    typeof children === 'string' ? children.replace(/_/g, ' ') : children;
  return (
    <span>
      {' / '}
      {to ? (
        // @ts-ignore: Link needs to be migrated.
        <Link to={to} className={css('breadcrumb-link')}>
          {childrenToPass}
        </Link>
      ) : (
        childrenToPass
      )}{' '}
    </span>
  );
};

type BreadCrumbsForOtherProps = {
  other: string[];
};

const BreadCrumbsForOther = ({ other }: BreadCrumbsForOtherProps) => {
  if (!other.length) return null;
  return (
    <section className={css('main')}>
      {other.map((part, i) => (
        <BreadCrumb
          key={i}
          to={{
            description: { other: other.slice(0, i + 1) },
          }}
        >
          {part}
        </BreadCrumb>
      ))}
    </section>
  );
};

const BreadCrumbsForSearchOrResult = ({ location }: OnlyLocationProps) => {
  if (!['search', 'result'].includes(location?.main?.key as string))
    return null;

  const key = location?.main?.key;

  if (key) {
    const { type } = location[key as 'search' | 'result'];

    let job: string | null | undefined = null;
    let accession: string | null | undefined = null;
    let value: string | null | undefined = null;

    if (key === 'result') {
      job = location[key].job;
      accession = location[key].accession;
    } else if (key === 'search') {
      value = location[key].value;
    }

    return (
      <>
        <section className={css('main')}>
          <BreadCrumb to={{ description: { main: location.main } }}>
            {location.main.key}
          </BreadCrumb>
          <BreadCrumb
            to={{
              description: {
                main: location.main,
                [location.main.key as string]: { type },
              },
            }}
          >
            {type}
          </BreadCrumb>
          {job && (
            <BreadCrumb
              to={{
                description: {
                  main: location.main,
                  [location.main.key as string]: { type, job },
                },
              }}
            >
              {job}
            </BreadCrumb>
          )}
          {
            // Remove internal id from breadcrumb
            /* {accession && (
            <BreadCrumb
              to={{
                description: {
                  main: location.main,
                  [location.main.key as string]: { type, job, accession },
                },
              }}
            >
              {accession}
            </BreadCrumb>
          )}
          */
          }
          {value && <BreadCrumb>{value}</BreadCrumb>}
        </section>
        {accession && <BreadCrumbForSecondPart location={location} />}
      </>
    );
  }
};

type BreadCrumbForFiltersProps = {
  location: InterProDescription;
  filters: string[];
};

const BreadCrumbForFilters = ({
  location,
  filters,
}: BreadCrumbForFiltersProps) => {
  return filters.map((ep) => {
    const db = location[ep as Endpoint].db;
    const accession = location[ep as Endpoint].accession;

    return (
      <section className={css('filter')} key={ep}>
        <BreadCrumb
          to={{
            description: { ...location, [ep]: { db, isFilter: true } },
          }}
        >
          {ep}{' '}
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: { ...location, [ep]: { db, isFilter: true } },
          }}
        >
          {db}
        </BreadCrumb>
        {accession && (
          <BreadCrumb
            to={{
              description: {
                ...location,
                [ep]: { db, accession, isFilter: true },
              },
            }}
          >
            {accession}
          </BreadCrumb>
        )}
      </section>
    );
  });
};

type BreadCrumbForEntityDetailProps = {
  location: InterProDescription;
  detail?: string;
  filters: string[];
};

const BreadCrumbForEntityDetail = ({
  location,
  detail,
  filters = [],
}: BreadCrumbForEntityDetailProps) => {
  let detailToRender = filters.length > 0 || detail ? detail : ' Overview';

  if (detail) {
    if (detailToRender?.includes('alphafold')) detailToRender = 'AlphaFold';
    else if (detailToRender?.includes('bfvd')) detailToRender = 'BFVD';
  }

  return (
    <section className={css('detail')}>
      {detailToRender && (
        <BreadCrumb
          to={{
            description: {
              ...location,
            },
          }}
        >
          {detailToRender}
        </BreadCrumb>
      )}
      <BreadCrumbForFilters location={location} filters={filters} />
    </section>
  );
};

const BreadCrumbForSecondPart = ({ location }: OnlyLocationProps) => {
  const accession = location[location?.main?.key as Endpoint].accession;
  const detail = location[location?.main?.key as Endpoint].detail;

  const filters = Object.keys(location).filter(
    (ep) => location[ep as Endpoint]?.isFilter,
  );

  return (
    <section className={css('secondary')}>
      {accession ? (
        <BreadCrumbForEntityDetail
          location={location}
          detail={detail as string}
          filters={filters}
        />
      ) : (
        <BreadCrumbForFilters location={location} filters={filters} />
      )}
    </section>
  );
};

const BreadCrumbsForBrowse = ({ location }: OnlyLocationProps) => {
  const endpoint = location?.main?.key;

  if (!config.endpoints.includes(endpoint)) return null;

  const accession = location[endpoint as Endpoint].accession;
  const db = location[endpoint as Endpoint].db;

  return (
    <>
      <section className={css('main')}>
        <BreadCrumb
          to={{
            description: { main: { key: 'entry' }, entry: { db: 'interpro' } },
          }}
        >
          Browse
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: {
              main: { key: endpoint },
              [endpoint as string]: { db },
            },
          }}
        >
          By{' '}
          {db &&
          db.toLowerCase() === 'pfam' &&
          (endpoint as string).toLowerCase() === 'set'
            ? 'clan'
            : endpoint}{' '}
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: {
              main: { key: endpoint },
              [endpoint as string]: { db },
            },
          }}
        >
          {db}
        </BreadCrumb>
        {accession && (
          <BreadCrumb
            to={{
              description: {
                main: { key: endpoint },
                [endpoint as string]: { db, accession },
              },
            }}
          >
            {accession}{' '}
          </BreadCrumb>
        )}
      </section>
      <BreadCrumbForSecondPart location={location} />
    </>
  );
};

type BreadCrumbsProps = {
  location: InterProDescription;
  hash: string;
};

const BreadCrumbs = ({ location, hash }: BreadCrumbsProps) => {
  // Dont show if it is at home
  if (!location?.main?.key && !location?.other?.length) return null;
  return (
    <nav className={css('breadcrumbs')}>
      <Link to={{ description: {} }} className={css('breadcrumb-link')}>
        <span
          className={css('small', 'icon', 'icon-common')}
          data-icon="&#xf015;"
          aria-label={'Home'}
        />
      </Link>

      <BreadCrumbsForOther other={location?.other} />
      <BreadCrumbsForSearchOrResult location={location} />
      <BreadCrumbsForBrowse location={location} />
      {location?.main?.key === 'result' && hash?.startsWith('/') && (
        <BreadCrumb>API Download Form</BreadCrumb>
      )}
    </nav>
  );
};

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({
    location: customLocation.description,
    hash: customLocation.hash,
  }),
);

export default connect(mapStateToProps)(BreadCrumbs);
