import React, { PureComponent } from 'react';
import T from 'prop-types';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';
import MemberDBTabs from 'components/MemberDBTabs';
import ProteinListFilters from 'components/Protein/ProteinListFilters';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import BrowseTabs from 'components/BrowseTabs';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import Loading from 'components/SimpleCommonComponents/Loading';

const f = foundationPartial(fonts, global, pageStyle, ipro, styles);

// const SVG_WIDTH = 100;
// const colorHash = new ColorHash();

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

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    const { data: { payload = defaultPayload } } = this.props;
    return (
      <ul className={f('card')}>
        {Object.entries(payload.proteins || {}).map(([name, count]) => (
          <li key={name}>
            <Link
              to={{
                description: {
                  main: { key: 'protein' },
                  protein: { db: name },
                },
              }}
            >
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
          <ProteinListFilters />
          <hr />
          <Table
            dataTable={_payload.results}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            pathname=""
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
            <SearchBox search={search.search} pathname="">
              Search proteins
            </SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */) => (
                <Link
                  to={location => ({
                    ...location,
                    description: {
                      main: { key: location.description.mainType },
                      [location.description.mainType]: {
                        db: location.description.mainDB,
                        accession,
                      },
                    },
                    search: {},
                  })}
                >
                  <span className={f('acc-row')}>
                    <HighlightedText
                      text={accession}
                      textToHighlight={search.search}
                    />
                  </span>
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
                  to={location => ({
                    ...location,
                    description: {
                      main: { key: location.description.mainType },
                      [location.description.mainType]: {
                        db: location.description.mainDB,
                        accession,
                      },
                    },
                    search: {},
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Name
            </Column>
            <Column
              dataKey="source_database"
              className={f('table-center')}
              renderer={(db /*: string */) => (
                <span
                  key="1"
                  className={f('icon', 'icon-functional')}
                  data-icon={db === 'reviewed' ? '/' : ''}
                  title={
                    db === 'reviewed'
                      ? `${db} by curators (Swiss-Prot)`
                      : 'Not reviewed by curators (TrEMBL)'
                  }
                />
              )}
            >
              Reviewed
            </Column>
            <Column dataKey="source_organism.fullname">Species</Column>
            <Column
              dataKey="length"
              className={f('text-right')}
              renderer={(length /*: number */) => (
                <NumberLabel
                  value={length}
                  title={`${length.toLocaleString()} amino acids`}
                />
              )}
            >
              Length
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/Protein/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForProtein = new Set();
for (const subPage of config.pages.protein.subPages) {
  subPagesForProtein.add({
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
    return <SummaryAsync data={payload} location={location} />;
  }
}

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@mainEntityOfPage',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': data.metadata.source_database,
  },
  mainEntity: '@mainEntity',
  seeAlso: '@seeAlso',
});

const schemaProcessData2 = data => ({
  '@type': ['Protein', 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
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
      return <Loading />;
    }
    return (
      <div>
        <div className={f('row')}>
          <div className={f('medium-12', 'large-12', 'columns')}>
            <Title metadata={payload.metadata} mainType="protein" />
            <BrowseTabs />
          </div>
        </div>
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
            locationSelector={l => {
              const { key } = l.description.main;
              return (
                l.description[key].detail ||
                Object.entries().find(([_key, value]) => value.isFilter)[0]
              );
            }}
            indexRoute={SummaryComponent}
            childRoutes={subPagesForProtein}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const acc = /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;
// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => {
        const { key } = l.description.main;
        return (
          l.description[key].accession ||
          Object.entries().find(([_key, value]) => value.isFilter)[0]
        );
      }}
      indexRoute={List}
      childRoutes={[{ value: acc, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const Protein = props => (
  <div className={f('with-data', { ['with-stale-data']: props.isStale })}>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={l => l.description[l.description.main.key].db}
        indexRoute={Overview}
        catchAll={InnerSwitch}
      />
    </ErrorBoundary>
  </div>
);
Protein.propTypes = {
  isStale: T.bool.isRequired,
};

export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('domain_architecture', 'entry')
    .replace('sequence', ''),
)(Protein);
