// @flow
import React from 'react';
import T from 'prop-types';
// $FlowFixMe
import { customLocationSelector } from 'reducers/custom-location';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';
import config from 'config';

const f = foundationPartial(fonts, styles);

/*::
  type Endpoint ={
    detail: string,
    db: string,
    accession: string,
    isFilter: boolean,
    order: number,
  }
  type SearchLocation = {
    type: string,
    value: string,
    accession: string,
    isFilter: boolean,
    order: number,
  }
  type Location = {
    main: {
      key: string,
      isFilter: boolean,
      order: number,
    },
    search: SearchLocation,
    result: SearchLocation,
    [string]: Endpoint,
    other: Array<string>,
  }
*/

const locationType = T.shape({
  main: T.shape({ key: T.string }),
  entry: T.shape({
    detail: T.string,
    db: T.string,
    accession: T.string,
    isFilter: T.bool,
    order: T.number,
  }),
  other: T.arrayOf(T.string),
});
const BreadCrumb = (
  { to, children } /*: {
    children: any,
    to?: function | {description: Object}} */,
) => {
  const childrenToPass =
    typeof children === 'string' ? children.replace(/_/g, ' ') : children;
  return (
    <span>
      {' / '}
      {to ? (
        <Link to={to} className={f('breadcrumb-link')}>
          {childrenToPass}
        </Link>
      ) : (
        childrenToPass
      )}{' '}
    </span>
  );
};
BreadCrumb.propTypes = {
  to: T.oneOfType([T.func, T.object]),
  children: T.any,
};

const BreadCrumbsForOther = ({ other } /*: { other: Array<string>} */) => {
  if (!other.length) return null;
  return (
    <section className={f('main')}>
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
BreadCrumbsForOther.propTypes = {
  other: T.arrayOf(T.string),
};

const BreadCrumbsForSearchOrResult = (
  { location } /*: {location: Location} */,
) => {
  if (!['search', 'result'].includes(location?.main?.key)) return null;
  // $FlowFixMe[incompatible-type]
  const key /*: 'search' | 'result' */ = location.main.key;
  const { type, value, accession } = location[key];
  return (
    <>
      <section className={f('main')}>
        <BreadCrumb to={{ description: { main: location.main } }}>
          {location.main.key}
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: { main: location.main, [location.main.key]: { type } },
          }}
        >
          {type}
        </BreadCrumb>
        {accession && (
          <BreadCrumb
            to={{
              description: {
                main: location.main,
                [location.main.key]: { type, accession },
              },
            }}
          >
            {accession}
          </BreadCrumb>
        )}
        {value && <BreadCrumb>{value}</BreadCrumb>}
      </section>
      {accession && <BreadCrumbForSecondPart location={location} />}
    </>
  );
};
BreadCrumbsForSearchOrResult.propTypes = {
  location: locationType,
};

const BreadCrumbForFilters = ({ location, filters }) => {
  return filters.map((ep) => {
    const { db, accession } = location[ep];
    return (
      <section className={f('filter')} key={ep}>
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
BreadCrumbForFilters.propTypes = {
  location: locationType,
  filters: T.arrayOf(T.string),
};

const BreadCrumbForEntityDetail = (
  {
    location,
    detail,
    filters = [],
  } /*: {location: Location, detail?: string, filters: Array<string>} */,
) => {
  const detailToRender = !filters.length && !detail ? ' Overview' : detail;
  return (
    <section className={f('detail')}>
      {detailToRender && (
        <BreadCrumb
          to={
            detail && {
              description: {
                ...location,
                [location.main.key]: {
                  ...location[location.main.key],
                  detail,
                },
              },
            }
          }
        >
          {detailToRender}
        </BreadCrumb>
      )}
      <BreadCrumbForFilters location={location} filters={filters} />
    </section>
  );
};
BreadCrumbForEntityDetail.propTypes = {
  location: locationType,
  filters: T.arrayOf(T.string),
  detail: T.string,
};

const BreadCrumbForSecondPart = ({ location } /*: {location: Location} */) => {
  const { accession, detail } = location[location.main.key];
  const filters = Object.keys(location)
    // $FlowFixMe[prop-missing]
    .filter((ep) => location[ep]?.isFilter)
    .sort(
      (ep1, ep2) =>
        // $FlowFixMe[prop-missing]
        location[ep1]?.order - location[ep2].order,
    );
  return (
    <section className={f('secondary')}>
      {accession ? (
        <BreadCrumbForEntityDetail
          location={location}
          detail={detail}
          filters={filters}
        />
      ) : (
        <BreadCrumbForFilters location={location} filters={filters} />
      )}
    </section>
  );
};
BreadCrumbForSecondPart.propTypes = {
  location: locationType,
};

const BreadCrumbsForBrowse = ({ location } /*: {location: Location} */) => {
  const endpoint = location?.main?.key;
  if (!config.endpoints.includes(endpoint)) return null;
  const { db, accession } = location[location.main.key];
  return (
    <>
      <section className={f('main')}>
        <BreadCrumb
          to={{
            description: { main: { key: 'entry' }, entry: { db: 'interpro' } },
          }}
        >
          Browse
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: { main: { key: endpoint }, [endpoint]: { db } },
          }}
        >
          By{' '}
          {db && db.toLowerCase() === 'pfam' && endpoint.toLowerCase() === 'set'
            ? 'clan'
            : endpoint}{' '}
        </BreadCrumb>
        <BreadCrumb
          to={{
            description: { main: { key: endpoint }, [endpoint]: { db } },
          }}
        >
          {db}
        </BreadCrumb>
        {accession && (
          <BreadCrumb
            to={{
              description: {
                main: { key: endpoint },
                [endpoint]: { db, accession },
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
BreadCrumbsForBrowse.propTypes = {
  location: locationType,
};

const BreadCrumbs = (
  { location, hash } /*: {location: Location, hash: string} */,
) => {
  // Dont show if it is at home
  if (!location?.main?.key && !location?.other?.length) return null;
  return (
    <nav className={f('breadcrumbs')}>
      <Link to={{ description: {} }} className={f('breadcrumb-link')}>
        <span
          className={f('small', 'icon', 'icon-common')}
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
BreadCrumbs.propTypes = {
  location: locationType,
  hash: T.string,
};

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({
    location: customLocation.description,
    hash: customLocation.hash,
  }),
);

export default connect(mapStateToProps)(BreadCrumbs);
