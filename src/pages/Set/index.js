import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import { OldSwitch } from 'components/generic/Switch';
import { OldLink } from 'components/generic/Link';
import MemberDBTabs from 'components/MemberDBTabs';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import BrowseTabs from 'components/BrowseTabs';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import { setDB } from 'utils/processLocation/handlers';
const f = foundationPartial(fonts, pageStyle, ipro, global);

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
      return <Loading />;
    }
    const { data: { payload = defaultPayload } } = this.props;
    return (
      <ul className={f('card')}>
        {Object.entries(payload.sets || {})
          .filter(set => set[0] !== 'kegg')
          .map(([name, count]) => (
            <li key={name}>
              <OldLink
                newTo={{ description: { mainType: 'set', mainDB: name } }}
              >
                {name}
                {Number.isFinite(count) ? ` (${count})` : ''}
              </OldLink>
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
            pathname=""
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
            <SearchBox search={search.search} pathname="">
              Search Entry Sets
            </SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, { source_database }) => (
                <OldLink
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: source_database,
                      mainAccession: accession,
                    },
                  })}
                >
                  <span className={f('acc-row')}>
                    <HighlightedText
                      text={accession}
                      textToHighlight={search.search}
                    />
                  </span>
                </OldLink>
              )}
            >
              Accession
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession, source_database } /*: {accession: string} */,
              ) => (
                <OldLink
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: source_database,
                      mainAccession: accession,
                    },
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </OldLink>
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
        }),
      }),
    }).isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading || !payload.metadata) {
      return <Loading />;
    }
    let currentSet = null;
    Array.from(setDB).forEach(db => {
      if (db.name === payload.metadata.source_database) currentSet = db;
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
          <div className={f('row')}>
            <div className={f('medium-12', 'large-12', 'columns')}>
              <Title metadata={payload.metadata} mainType="set" />
              <BrowseTabs />
            </div>
          </div>
          <OldSwitch
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
    .map(db => db.re.source)
    .filter(db => db)
    .join('|'),
  'i',
);

const InnerSwitch = props => (
  <ErrorBoundary>
    <OldSwitch
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
      <OldSwitch
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
