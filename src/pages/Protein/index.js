// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
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

import EntryMenu from 'components/EntryMenu';
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
    ok: T.bool,
  }).isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
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
          <ProteinListFilters />
          <hr />
          <Table
            dataTable={_payload.results}
            isStale={isStale}
            loading={loading}
            ok={ok}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={url} download="proteins.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="proteins.tsv"
                  >
                    TSV
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href={url}>
                    Open in API web view
                  </Link>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <SearchBox search={search.search}>Search proteins</SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, { source_database: db }) => (
                <React.Fragment>
                  <Link
                    to={customLocation => ({
                      ...customLocation,
                      description: {
                        main: { key: 'protein' },
                        protein: {
                          db: customLocation.description.protein.db,
                          accession,
                        },
                      },
                      search: {},
                    })}
                    className={f('acc-row')}
                  >
                    <HighlightedText
                      text={accession}
                      textToHighlight={search.search}
                    />
                  </Link>
                  {db === 'reviewed' ? (
                    <React.Fragment>
                      {'\u00A0' /* non-breakable space */}
                      <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                        <span
                          className={f('icon', 'icon-functional')}
                          data-icon="/"
                          aria-label="reviewed"
                        />
                      </Tooltip>
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
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
                  to={customLocation => ({
                    ...customLocation,
                    description: {
                      main: { key: 'protein' },
                      protein: {
                        db: customLocation.description.protein.db,
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
              dataKey="source_organism"
              renderer={({ fullname, taxid }) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        db: 'taxonomy',
                        accession: `${taxid}`,
                      },
                    },
                  }}
                >
                  {fullname}
                </Link>
              )}
            >
              Species
            </Column>
            <Column
              dataKey="length"
              headerClassName={f('text-right')}
              renderer={(length /*: number */) => (
                <Tooltip title={`${length.toLocaleString()} amino acids`}>
                  <span aria-label="amino acids length">{length}</span>
                </Tooltip>
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
    customLocation: T.object.isRequired,
  };

  render() {
    const { data: { payload }, customLocation } = this.props;
    return <SummaryAsync data={payload} customLocation={customLocation} />;
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
      <React.Fragment>
        <div className={f('row')}>
          <div className={f('medium-12', 'large-12', 'columns')}>
            <Title metadata={payload.metadata} mainType="protein" />
            <EntryMenu metadata={payload.metadata} />
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
                (Object.entries(l.description).find(
                  ([_key, value]) => value.isFilter,
                ) || [])[0]
              );
            }}
            indexRoute={SummaryComponent}
            childRoutes={subPagesForProtein}
          />
        </ErrorBoundary>
      </React.Fragment>
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
          (Object.entries(l.description).find(
            ([_key, value]) => value.isFilter,
          ) || [])[0]
        );
      }}
      indexRoute={List}
      childRoutes={[{ value: acc, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const Protein = props => (
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

export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('domain_architecture', 'entry')
    .replace('sequence', ''),
)(Protein);
