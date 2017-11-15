import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBTabs from 'components/MemberDBTabs';
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

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import { setDB } from 'utils/processLocation/handlers';
const f = foundationPartial(fonts, pageStyle, ipro, styles);

// const SVG_WIDTH = 100;
// const colorHash = new ColorHash();

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  loading: T.bool,
  isStale: T.bool.isRequired,
  location: T.shape({
    description: T.object.isRequired,
  }).isRequired,
};

const defaultPayload = {
  sets: {},
};

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    if (this.props.loading) {
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading…</div>
        </div>
      );
    }
    const { data: { payload = defaultPayload } } = this.props;
    return (
      <ul className={f('card')}>
        {Object.entries(payload.sets || {})
          .filter(set => set[0] !== 'kegg')
          .map(([name, count]) => (
            <li key={name}>
              <Link newTo={{ description: { mainType: 'set', mainDB: name } }}>
                {name}
                {Number.isFinite(count) ? ` (${count})` : ''}
              </Link>
            </li>
          ))}
      </ul>
    );
  }
}

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, url, status },
      isStale,
      location: { search },
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    // const maxLength = _payload.results.reduce(
    //   (max, result) => Math.max(max, (result.metadata || result).length),
    //   0,
    // );
    return (
      <div className={f('row')}>
        <MemberDBTabs />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
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
                  <a href={url} download="sets.json">
                    JSON
                  </a>
                </li>
                <li>
                  <a href={url} download="sets.tsv">
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
              Search Entry Sets
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
                  <span className={f('acc-row')}>{accession}</span>
                </Link>
              )}
            >
              Accession
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
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
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/Set/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForSet = new Set();
for (const subPage of config.pages.set.subPages) {
  subPagesForSet.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

class SummaryComponent extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.any,
    }).isRequired,
    location: T.object.isRequired,
  };

  render() {
    const { data: { payload }, location } = this.props;
    return <SummaryAsync {...this.props} data={payload} location={location} />;
  }
}

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@mainEntityOfPage',
  additionalType: 'http://semanticscience.org/resource/SIO_010043',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': data.metadata.source_database,
  },
  mainEntity: '@mainEntity',
  seeAlso: '@seeAlso',
});

const schemaProcessData2 = data => ({
  '@type': ['StructuredValue', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  additionalType: 'http://semanticscience.org/resource/SIO_010043',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  additionalProperty: '@additionalProperty',
});

class Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        metadata: T.shape({
          accession: T.string.isRequired,
        }).isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading || !payload.metadata) {
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading…</div>
        </div>
      );
    }
    let currentSet = null;
    Array.from(setDB).forEach(db => {
      if (db.name === 'pfam') currentSet = db;
    });
    return (
      <div>
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData}
            />
          )}
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData2}
            />
          )}
        <ErrorBoundary>
          <Switch
            {...this.props}
            currentSet={currentSet}
            locationSelector={l =>
              l.description.mainDetail || l.description.focusType
            }
            indexRoute={SummaryComponent}
            childRoutes={subPagesForSet}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const dbAccs = new RegExp(
  Array.from(setDB)
    .map(db => db.re)
    .filter(db => db)
    .join('|'),
  'i',
);

const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l =>
        l.description.mainAccession || l.description.focusType
      }
      indexRoute={List}
      childRoutes={[{ value: dbAccs, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const EntrySet = props => (
  <div className={f('with-data', { ['with-stale-data']: props.isStale })}>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={l => l.description.mainDB}
        indexRoute={Overview}
        catchAll={InnerSwitch}
      />
    </ErrorBoundary>
  </div>
);
EntrySet.propTypes = {
  isStale: T.bool.isRequired,
};

export default loadData()(EntrySet);
