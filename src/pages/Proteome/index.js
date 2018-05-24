import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
// import OrganismListFilters from 'components/Organism/OrganismListFilters';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import ProteinFile from 'subPages/Organism/ProteinFile';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import { NumberComponent } from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(pageStyle, styles, fonts);

const EntryAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="entry-accession" />
);

const ProteinAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="protein-accession" />
);

const ProteinFastasRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="FASTA" />
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "organism-summary" */ 'components/Organism/Summary'),
});

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
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }),
};

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
            main: { key: 'proteome' },
            entry: { isFilter: true },
            protein: { isFilter: true },
            proteome: { db: sourceDatabase, accession },
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
            main: { key: 'proteome' },
            entry: { isFilter: true, db: entryDB },
            protein: { isFilter: true },
            proteome: { db: sourceDatabase, accession },
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

const subPagesForProteome = new Map();
for (const subPage of config.pages.proteome.subPages) {
  subPagesForProteome.set(subPage, subPages.get(subPage));
}

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search },
      dataBase,
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="proteome"
          className="left-side-db-selector"
        />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          {/*<OrganismListFilters />*/}
          <hr />
          {databases && (
            <SchemaOrgData
              data={{
                data: { db: databases.uniprot },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}
          <Table
            dataTable={_payload.results}
            contentType="proteome"
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
                  <Link href={url} download="proteome.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="proteome.tsv"
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
            <SearchBox search={search.search}>Search organism</SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <Link
                  to={customLocation => ({
                    description: {
                      main: { key: 'proteome' },
                      proteome: {
                        ...customLocation.description.proteome,
                        accession: accession.toString(),
                      },
                    },
                  })}
                >
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'proteome' },
                      location: window.location,
                    }}
                    processData={schemaProcessDataTableRow}
                  />
                  <HighlightedText
                    text={accession}
                    textToHighlight={search.search}
                  />
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
                  to={customLocation => ({
                    description: {
                      main: { key: 'proteome' },
                      proteome: {
                        ...customLocation.description.proteome,
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
                              main: { key: 'taxonomy' },
                              taxonomy: {
                                db: 'uniprot',
                                accession: `${accession}`,
                              },
                              entry: { isFilter: true, db: db || 'all' },
                            },
                          }}
                        >
                          <NumberComponent
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
              renderer={(accession /*: string */, { source_database: db }) => {
                const DataProvider = dataProviderFor(`${accession}`, db);
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
                              main: { key: 'taxonomy' },
                              taxonomy: {
                                db: 'uniprot',
                                accession: `${accession}`,
                              },
                              protein: { isFilter: true, db: 'UniProt' },
                            },
                          }}
                        >
                          <NumberComponent
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
              <Tooltip title="All the proteins for this taxonomy containing an entry from the selected database">
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

const subpagesRoutes = /(UP\d{9})|(all)/i;

const Proteome = () => (
  <EndPointPage
    subpagesRoutes={subpagesRoutes}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForProteome}
  />
);

export default Proteome;
