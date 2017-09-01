import React from 'react';
import T from 'prop-types';
import ColorHash from 'color-hash/lib/color-hash';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBTabs from 'components/Entry/MemberDBTabs';
import ProteinListFilters from 'components/Protein/ProteinListFilters';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import subPages from 'subPages';
import config from 'config';

import classname from 'classnames/bind';

import f from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from './style.css';

const ps = classname.bind(pageStyle);

const SVG_WIDTH = 100;
const colorHash = new ColorHash();

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.shape({
    description: T.object.isRequired,
  }).isRequired,
  match: T.string,
};

const defaultPayload = {
  proteins: {
    uniprot: null,
    reviewed: null,
    unreviewed: null,
  },
};

const Overview = ({ data: { payload = defaultPayload } }) => (
  <ul className={styles.card}>
    {Object.entries(payload.proteins || {}).map(([name, count]) => (
      <li key={name}>
        <Link newTo={{ description: { mainType: 'protein', mainDB: name } }}>
          {name}
          {Number.isFinite(count) ? ` (${count})` : ''}
        </Link>
      </li>
    ))}
  </ul>
);
Overview.propTypes = propTypes;

const List = ({
  data: { payload, loading, url, status },
  isStale,
  location: { search },
}) => {
  let _payload = payload;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  if (loading || notFound) {
    _payload = {
      results: [],
    };
  }
  const maxLength = _payload.results.reduce(
    (max, result) => Math.max(max, (result.metadata || result).length),
    0
  );
  return (
    <div className={f('row')}>
      <MemberDBTabs />

      <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
        <ProteinListFilters />
        <hr />
        <Table
          dataTable={_payload.results}
          isStale={isStale}
          actualSize={_payload.count}
          query={search}
          pathname={''}
          notFound={notFound}
        >
          <Exporter>
            <ul>
              <li>
                <a href={url} download="proteins.json">
                  JSON
                </a>
              </li>
              <li>
                <a href={url} download="proteins.tsv">
                  TSV
                </a>
              </li>
              <li>
                <a target="_blank" rel="noopener noreferrer" href={url}>
                  Open in API web view
                </a>
              </li>
            </ul>
          </Exporter>
          <PageSizeSelector />
          <SearchBox search={search.search} pathname={''}>
            Search proteins
          </SearchBox>
          <Column
            dataKey="accession"
            renderer={(accession /*: string */) => (
              <Link
                newTo={location => ({
                  ...location,
                  description: {
                    mainType: location.description.mainType,
                    mainDB: location.description.mainDB,
                    mainAccession: accession,
                  },
                })}
              >
                {accession}
              </Link>
            )}
          >
            Accession
          </Column>
          <Column
            dataKey="name"
            renderer={(
              name /*: string */,
              { accession } /*: {accession: string} */
            ) => (
              <Link
                newTo={location => ({
                  ...location,
                  description: {
                    mainType: location.description.mainType,
                    mainDB: location.description.mainDB,
                    mainAccession: accession,
                  },
                })}
              >
                {name}
              </Link>
            )}
          >
            Name
          </Column>
          <Column
            dataKey="source_database"
            renderer={(db /*: string */) => (
              <Link
                newTo={location => ({
                  ...location,
                  description: {
                    mainType: location.description.mainType,
                    mainDB: location.description.mainDB,
                  },
                })}
              >
                {db}
              </Link>
            )}
          >
            Source Database
          </Column>
          <Column dataKey="source_organism.fullname">Species</Column>
          <Column
            dataKey="length"
            renderer={(length /*: number */, row) => (
              <div
                title={`${length} amino-acids`}
                style={{
                  width: `${length / maxLength * SVG_WIDTH}%`,
                  padding: '0.2rem',
                  backgroundColor: colorHash.hex(row.accession),
                  borderRadius: '0.2rem',
                  textAlign: 'start',
                  overflowX: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'clip',
                }}
              >
                {length} amino-acids
              </div>
            )}
          >
            Length
          </Column>
        </Table>
      </div>
    </div>
  );
};
List.propTypes = propTypes;

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/Protein/Summary'),
});

const subPagesForProtein = new Set();
for (const subPage of config.pages.protein.subPages) {
  subPagesForProtein.add({
    value: subPage.replace(/\s+/g, '_'),
    component: subPages.get(subPage),
  });
}

const SummaryComponent = ({ data: { payload }, location }) => (
  <SummaryAsync data={payload} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.any,
  }).isRequired,
  location: T.object.isRequired,
};

const Summary = props => {
  const { data: { loading, payload } } = props;
  if (loading || !payload.metadata) return <div>Loading…</div>;
  return (
    <div>
      <Switch
        {...props}
        locationSelector={l =>
          l.description.mainDetail || l.description.focusType}
        indexRoute={SummaryComponent}
        childRoutes={subPagesForProtein}
      />
    </div>
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
  }).isRequired,
  location: T.object.isRequired,
};

const acc = /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;
// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <Switch
    {...props}
    locationSelector={l =>
      l.description.mainAccession || l.description.focusType}
    indexRoute={List}
    childRoutes={[{ value: acc, component: Summary }]}
    catchAll={List}
  />
);

const Protein = props => (
  <div className={ps('with-data', { ['with-stale-data']: props.isStale })}>
    <Switch
      {...props}
      locationSelector={l => l.description.mainDB}
      indexRoute={Overview}
      catchAll={InnerSwitch}
    />
  </div>
);
Protein.propTypes = {
  isStale: T.bool.isRequired,
};

export default loadData((...args) =>
  getUrlForApi(...args).replace('domain_architecture', 'entry')
)(Protein);
