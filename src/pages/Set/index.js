// @flow
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
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { setDBs } from 'utils/processDescription/handlers';

import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, pageStyle, ipro, global);

// const SVG_WIDTH = 100;
// const colorHash = new ColorHash();

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }).isRequired,
  loading: T.bool,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
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
              <Link
                to={{
                  description: { main: { key: 'set' }, set: { db: name } },
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
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search },
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBTabs />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <hr />
          <Table
            dataTable={_payload.results}
            loading={loading}
            ok={ok}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={url} download="sets.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="sets.tsv"
                  >
                    TSV
                  </Link>
                </li>
                <li>
                  <Link href={url}>Open in API web view</Link>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <SearchBox search={search.search}>Search Entry Sets</SearchBox>
            <Column
              dataKey="accession"
              // eslint-disable-next-line camelcase
              renderer={(accession /*: string */, { source_database }) => (
                <Link
                  to={customLocation => ({
                    ...customLocation,
                    description: {
                      main: { key: 'set' },
                      set: {
                        db: source_database,
                        accession,
                      },
                    },
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
                // eslint-disable-next-line camelcase
                { accession, source_database } /*: {accession: string} */,
              ) => (
                <Link
                  to={customLocation => ({
                    ...customLocation,
                    description: {
                      main: { key: 'set' },
                      set: {
                        db: source_database,
                        accession,
                      },
                    },
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
    customLocation: T.object.isRequired,
  };

  render() {
    const { data: { payload }, customLocation } = this.props;
    return (
      <SummaryAsync
        {...this.props}
        data={payload}
        customLocation={customLocation}
      />
    );
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
    for (const setDB of setDBs) {
      if (setDB.name === payload.metadata.source_database) {
        currentSet = setDB;
        break;
      }
    }
    return (
      <React.Fragment>
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
              <EntryMenu metadata={payload.metadata} />
            </div>
          </div>
          <Switch
            {...this.props}
            currentSet={currentSet}
            locationSelector={l => {
              const { key } = l.description.main;
              return (
                l.description[key].detail ||
                (Object.entries(l.description).find(
                  ([_key, value]) => value.isFilter,
                ) || [])[0]
              );
            }}
            indexRoute={SummaryComponent}
            childRoutes={subPagesForSet}
          />
        </ErrorBoundary>
      </React.Fragment>
    );
  }
}

const dbAccs = new RegExp(
  Array.from(setDBs)
    .map(db => db.re.source)
    .filter(db => db)
    .join('|'),
  'i',
);

const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => {
        const { key } = l.description.main;
        return (
          l.description[key].accession ||
          (Object.entries(l.description).find(
            ([_key, value]) => value.isFilter,
          ) || [])[0]
        );
      }}
      indexRoute={List}
      childRoutes={[{ value: dbAccs, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const EntrySet = props => (
  <div>
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

export default loadData()(EntrySet);
