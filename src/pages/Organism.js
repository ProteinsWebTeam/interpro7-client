import React from 'react';
import T from 'prop-types';

import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import subPages from 'subPages';
import config from 'config';

import classname from 'classnames/bind';

import f from 'styles/foundation';

import pageStyle from './style.css';
import styles from 'styles/blocks.css';

const ps = classname.bind(pageStyle);

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

const defaultPayload = {};

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
  return (
    <div className={f('row')}>
      <div className={f('columns')}>
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
                <a href={url} download="organisms.json">
                  JSON
                </a>
              </li>
              <li>
                <a href={url} download="organisms.tsv">
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
                    mainAccession: `${accession}`,
                  },
                })}
              >
                {accession}
              </Link>
            )}
          >
            TaxID
          </Column>
          <Column
            dataKey="full_name"
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
                    mainAccession: `${accession}`,
                  },
                })}
              >
                {name}
              </Link>
            )}
          >
            Name
          </Column>
        </Table>
      </div>
    </div>
  );
};
List.propTypes = propTypes;

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "organism-summary" */ 'components/Organism/Summary'),
});

const SummaryComponent = ({ data: { payload }, location }) => (
  <SummaryAsync data={payload} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.any,
  }).isRequired,
  location: T.object.isRequired,
};

const subPagesForOrganism = new Set();
for (const subPage of config.pages.organism.subPages) {
  subPagesForOrganism.add({
    value: subPage.replace(/\s+/g, '_'),
    component: subPages.get(subPage),
  });
}

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
        childRoutes={subPagesForOrganism}
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

const acc = /(UP\d{9})|(\d+)|(all)/i;
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

const Organism = props => (
  <div className={ps('with-data', { ['with-stale-data']: props.isStale })}>
    <Switch
      {...props}
      locationSelector={l => l.description.mainDB}
      indexRoute={Overview}
      catchAll={InnerSwitch}
    />
  </div>
);
Organism.propTypes = {
  isStale: T.bool.isRequired,
};

export default loadData()(Organism);
