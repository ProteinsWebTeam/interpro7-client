import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBTabs from 'components/MemberDBTabs';
import OrganismListFilters from 'components/Organism/OrganismListFilters';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import ProteinFile from 'subPages/Organism/ProteinFile';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';
import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';

const f = foundationPartial(pageStyle, styles);

const EntryAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="entry-accession" />
);

const ProteinAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="protein-accession" />
);

const ProteinFastasRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="FASTA" />
);

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

const defaultPayload = {};

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    const { data: { payload = defaultPayload } } = this.props;
    return (
      <ul className={f('card')}>
        {Object.entries(payload.organisms || {}).map(([name, count]) => (
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

// TODO: remove need for all of that. Might cause memory leaks?
const dataProviders = new Map();
class PlainDataProvider extends PureComponent {
  static propTypes = {
    dataEntry: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }),
    dataProtein: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }),
    db: T.string,
    renderer: T.func.isRequired,
  };

  render() {
    return this.props.renderer(
      this.props.dataEntry,
      this.props.dataProtein,
      this.props.db,
    );
  }
}
const dataProviderFor = (accession, sourceDatabase) => {
  let DataProvider = dataProviders.get(accession);
  if (DataProvider) return DataProvider;
  // create new one if not already existing
  const mapStateToUrlForEntry = createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'organism' },
            entry: { isFilter: true },
            protein: { isFilter: true },
            organism: { db: sourceDatabase, accession },
          }),
      }),
  );
  const mapStateToUrlForProtein = createSelector(
    state => state.settings.api,
    state => state.customLocation.description.entry.db,
    ({ protocol, hostname, port, root }, entryDB) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'organism' },
            entry: { isFilter: true, db: entryDB },
            protein: { isFilter: true },
            organism: { db: sourceDatabase, accession },
          }),
      }),
  );
  const mapStateToProps = createSelector(
    state => state.customLocation.description.entry.db,
    db => ({ db }),
  );
  DataProvider = connect(mapStateToProps)(
    loadData({ getUrl: mapStateToUrlForEntry, propNamespace: 'Entry' })(
      loadData({ getUrl: mapStateToUrlForProtein, propNamespace: 'Protein' })(
        PlainDataProvider,
      ),
    ),
  );
  dataProviders.set(accession, DataProvider);
  return DataProvider;
};

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
    const includeTree = url && !url.includes('proteome');
    return (
      <div className={f('row')}>
        <MemberDBTabs />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <OrganismListFilters />
          <hr />
          <Table
            dataTable={_payload.results}
            loading={loading}
            ok={ok}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withTree={includeTree}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={url} download="organisms.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="organisms.tsv"
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
              renderer={(accession /*: string */) => (
                <Link
                  to={customLocation => ({
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        ...customLocation.description.organism,
                        accession: customLocation.description.organism.db
                          ? accession.toString()
                          : null,
                        proteomeAccession: customLocation.description.organism
                          .proteomeDB
                          ? accession.toString()
                          : null,
                      },
                    },
                  })}
                >
                  <HighlightedText
                    text={accession}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Tax ID
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={customLocation => ({
                    description: {
                      main: { key: 'organism' },
                      organism: {
                        ...customLocation.description.organism,
                        accession: accession.toString(),
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
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entry-count"
              renderer={(accession /*: string */, { source_database: db }) => {
                const DataProvider = dataProviderFor(`${accession}`, db);
                return (
                  <DataProvider
                    renderer={({ loading, payload }, _, db) => {
                      let count = 0;
                      if (payload) {
                        if (db && db in payload.entries.member_databases) {
                          count = payload.entries.member_databases[db];
                        } else {
                          count = payload.entries[(db || 'all').toLowerCase()];
                        }
                      }
                      return (
                        <Link
                          className={f('no-decoration')}
                          to={{
                            description: {
                              main: { key: 'organism' },
                              organism: {
                                db: 'taxonomy',
                                accession: `${accession}`,
                              },
                              entry: { isFilter: true, db: db || 'all' },
                            },
                          }}
                        >
                          <NumberLabel
                            className={f('number-label')}
                            value={count}
                            loading={loading}
                            abbr
                          />
                        </Link>
                      );
                    }}
                  />
                );
              }}
            >
              Entry count
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entryAccessions"
              renderer={EntryAccessionsRenderer}
            >
              Entry accessions
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="protein-count"
              renderer={(accession /*: string */, { source_database }) => {
                const DataProvider = dataProviderFor(
                  `${accession}`,
                  source_database,
                );
                return (
                  <DataProvider
                    renderer={(_, { payload, loading }) => {
                      let count = 0;
                      if (payload) {
                        count = payload.proteins.uniprot;
                        if (typeof count === 'object') count = count.proteins;
                      }
                      return (
                        <Link
                          to={{
                            description: {
                              main: { key: 'organism' },
                              organism: {
                                db: 'taxonomy',
                                accession: `${accession}`,
                              },
                              protein: { isFilter: true, db: 'UniProt' },
                            },
                          }}
                        >
                          <NumberLabel
                            className={f('number-label')}
                            value={count}
                            loading={loading}
                            abbr
                          />
                        </Link>
                      );
                    }}
                  />
                );
              }}
            >
              <Tooltip title="All the proteins for this organism containing an entry from the selected database">
                Protein count
              </Tooltip>
            </Column>
            <Column
              dataKey="accession"
              defaultKey="proteinFastas"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={ProteinFastasRenderer}
            >
              FASTA
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="proteinAccessions"
              renderer={ProteinAccessionsRenderer}
            >
              Protein accessions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "organism-summary" */ 'components/Organism/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class SummaryComponent extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.any,
    }).isRequired,
    customLocation: T.object.isRequired,
  };

  render() {
    const { data: { payload, loading }, customLocation } = this.props;
    return (
      <SummaryAsync
        data={payload}
        customLocation={customLocation}
        loading={loading}
      />
    );
  }
}

const subPagesForOrganism = new Set();
for (const subPage of config.pages.organism.subPages) {
  subPagesForOrganism.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

const _Title = ({ data: { loading, payload } }) =>
  loading ? (
    <Loading />
  ) : (
    <Title metadata={payload.metadata} mainType="organism" />
  );
_Title.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
};

const mapStateToAccessionUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.organism.db,
  state => state.customLocation.description.organism.accession,
  state => state.customLocation.description.organism.proteomeDB,
  state => state.customLocation.description.organism.proteomeAccession,
  (
    { protocol, hostname, port, root },
    db,
    accession,
    proteomeDB,
    proteomeAccession,
  ) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/organism/${db || ''}/${accession || ''}/${
        proteomeAccession ? proteomeDB : ''
      }/${proteomeAccession || ''}`,
    }),
);

const LoadedTitle = loadData(mapStateToAccessionUrl)(_Title);

class Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
    }).isRequired,
    customLocation: T.object.isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading || !payload) {
      return <Loading />;
    }
    return (
      <ErrorBoundary>
        <div className={f('row')}>
          <div className={f('medium-12', 'large-12', 'columns')}>
            <LoadedTitle />
            <EntryMenu metadata={payload.metadata} />
          </div>
        </div>
        <Switch
          {...this.props}
          locationSelector={l => {
            const { key } = l.description.main;
            return (
              l.description[key].detail ||
              (Object.entries(l.description).find(
                ([_key, value]) => value.isFilter,
              ) || [])[0] ||
              (l.description[key].accession && l.description[key].proteomeDB)
            );
          }}
          indexRoute={SummaryComponent}
          childRoutes={subPagesForOrganism}
        />
      </ErrorBoundary>
    );
  }
}

const acc = /(UP\d{9})|(\d+)|(all)/i;
// Keep outside! Otherwise will be redefined at each render of the outer Switch
class InnerSwitch extends PureComponent {
  render() {
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={l => {
            const { key } = l.description.main;
            return (
              l.description[key].proteomeAccession ||
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
  }
}

const schemaProcessData = data => ({
  '@type': ['Organism', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  inDataset: data.metadata.source_database,
  biologicalType:
    data.metadata.source_database === 'taxonomy' ? 'taxon' : 'proteome',
  citation: '@citation',
  isBasedOn: '@isBasedOn',
  isBasisFor: '@isBasisFor',
});

class Organism extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    const { data } = this.props;
    return (
      <div>
        {data.payload &&
          data.payload.metadata &&
          data.payload.metadata.accession && (
            <SchemaOrgData
              data={data.payload}
              processData={schemaProcessData}
            />
          )}
        <ErrorBoundary>
          <Switch
            {...this.props}
            locationSelector={l =>
              l.description[l.description.main.key].db ||
              l.description[l.description.main.key].proteomeDB
            }
            indexRoute={Overview}
            catchAll={InnerSwitch}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default loadData()(Organism);
