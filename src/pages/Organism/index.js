/* eslint-disable react/display-name */
import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import OrganismListFilters from 'components/Organism/OrganismListFilters';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import File from 'components/File';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';
import { NumberComponent } from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { toPlural } from 'utils/pages';
import getColor from 'utils/taxonomy/get-color';
import getIcon from 'utils/taxonomy/get-icon';
import getNodeSpotlight from 'utils/taxonomy/get-node-spotlight';
import getSuperKingdom from 'utils/taxonomy/get-super-kingdom';

import { mainDBLocationSelector } from 'reducers/custom-location/description';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
  schemaProcessDataRecord,
  schemaProcessMainEntity,
} from 'schema_org/processors';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { getUrlForMeta } from '../../higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(pageStyle, ebiGlobalStyles, fonts);

const EntryAccessionsRenderer = entryDB => taxId => (
  <File
    fileType="accession"
    name={`${entryDB || 'all'}-entry-accessions-for-${taxId}.txt`}
    customLocationDescription={{
      main: { key: 'entry' },
      entry: { db: entryDB || 'all' },
      organism: { isFilter: true, db: 'taxonomy', accession: `${taxId}` },
    }}
  />
);

const ProteinFastasRenderer = entryDB => taxId => (
  <File
    fileType="FASTA"
    name={`protein-sequences${
      entryDB ? `-matching-${entryDB}` : ''
    }-for-${taxId}.fasta`}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      entry: { isFilter: true, db: entryDB || 'all' },
      organism: { isFilter: true, db: 'taxonomy', accession: `${taxId}` },
    }}
  />
);

const ProteinAccessionsRenderer = entryDB => taxId => (
  <File
    fileType="accession"
    name={`protein-accessions${
      entryDB ? `-matching-${entryDB}` : ''
    }-for-${taxId}.txt`}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      entry: { isFilter: true, db: entryDB || 'all' },
      organism: { isFilter: true, db: 'taxonomy', accession: `${taxId}` },
    }}
  />
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
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }),
};

const defaultPayload = {};

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload = defaultPayload },
    } = this.props;
    return (
      <ul>
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

const SpeciesIcon = ({ lineage }) => {
  let icon = '.';
  let color;
  if (lineage) {
    icon = getIcon(lineage) || '.';
    color = getColor(lineage);
  }
  return (
    <span
      style={{ color }}
      className={f('small', 'icon', 'icon-species')}
      data-icon={icon}
    />
  );
};
SpeciesIcon.propTypes = {
  lineage: T.string.isRequired,
};

class SummaryCounterOrg extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    metadata: T.object.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;

    if (metadata.source_database === 'proteome') return null;

    const { entries, proteins, structures, proteomes } = counters;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${entries} ${entryDB || ''} ${toPlural(
            'entry',
            entries,
          )} matching ${metadata.name}`}
          className={f('count-entries')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'organism' },
                organism: {
                  db: 'taxonomy',
                  accession: metadata.accession.toString(),
                },
                entry: { isFilter: true, db: entryDB && 'all' },
              },
            }}
            disabled={!entries}
          >
            <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />
            <NumberComponent value={entries} abbr />
            <span className={f('label-number')}>
              {toPlural('entry', entries)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteins}  ${toPlural('protein', proteins)} matching ${
            metadata.name
          }`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'organism' },
                organism: {
                  db: 'taxonomy',
                  accession: metadata.accession.toString(),
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
            disabled={!proteins}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x50;" />{' '}
            <NumberComponent value={proteins} abbr />
            <span className={f('label-number')}>
              {' '}
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${structures} ${toPlural('structure', structures)} matching ${
            metadata.name
          }`}
          className={f('count-structures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'organism' },
                organism: {
                  db: 'taxonomy',
                  accession: `${metadata.accession}`,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x73;" />{' '}
            <NumberComponent value={structures} abbr />{' '}
            <span className={f('label-number')}>structures</span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteomes} proteomes matching ${metadata.name}`}
          className={f('count-proteomes')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'organism' },
                organism: {
                  db: metadata.source_database,
                  accession: `${metadata.accession}`,
                  proteomeDB: 'proteome',
                },
              },
            }}
            disabled={!proteomes}
          >
            <div className={f('icon', 'icon-common', 'icon-count-proteome')} />
            <NumberComponent value={proteomes} abbr />{' '}
            <span className={f('label-number')}>proteomes</span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}

const Lineage = ({ lineage }) => {
  const superkingdom = getSuperKingdom(lineage) || 'N/A';
  const nodespot = getNodeSpotlight(lineage);
  return (
    <Tooltip title={`Lineage: ${lineage}`}>
      {superkingdom} {nodespot && `(${nodespot})`}
    </Tooltip>
  );
};
Lineage.propTypes = {
  lineage: T.string.isRequired,
};

const OrganismCard = ({ data, search, entryDB }) => (
  <React.Fragment>
    <div className={f('card-header')}>
      <Link
        to={{
          description: {
            main: { key: 'organism' },
            organism: {
              db: data.metadata.source_database,
              accession: `${data.metadata.accession}`,
            },
          },
        }}
      >
        {data.metadata.source_database === 'taxonomy' && (
          <SpeciesIcon lineage={data.extra_fields.lineage} />
        )}
        <h6>
          <HighlightedText text={data.metadata.name} textToHighlight={search} />
        </h6>
      </Link>
    </div>

    <SummaryCounterOrg
      entryDB={entryDB}
      metadata={data.metadata}
      counters={data.extra_fields.counters}
    />

    <div className={f('card-footer')}>
      {data.metadata.source_database === 'taxonomy' && (
        <Lineage lineage={data.extra_fields.lineage} />
      )}
      <div>
        {`${
          data.metadata.source_database === 'taxonomy' ? 'Tax' : 'Proteome'
        } ID: `}
        <HighlightedText
          text={data.metadata.accession}
          textToHighlight={search}
        />
      </div>
    </div>
  </React.Fragment>
);
OrganismCard.propTypes = {
  data: T.object,
  search: T.string,
  entryDB: T.string,
};

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: {
        description: {
          entry: { db: entryDB },
        },
        search,
      },
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
    const includeTree = url && !url.includes('proteome');
    const includeGrid = url && !url.includes('proteome');
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="organism"
          className="left-side-db-selector"
        />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <OrganismListFilters />
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
            contentType="organism"
            loading={loading}
            ok={ok}
            status={status}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withTree={!!includeTree}
            withGrid={!!includeGrid}
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
            <Card>
              {data => (
                <OrganismCard
                  data={data}
                  search={search.search}
                  entryDB={entryDB}
                />
              )}
            </Card>
            <SearchBox>Search organism</SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
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
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'organism' },
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
              renderer={EntryAccessionsRenderer(entryDB)}
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
                              main: { key: 'organism' },
                              organism: {
                                db: 'taxonomy',
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
              <Tooltip title="All the proteins for this organism containing an entry from the selected database">
                Protein count
              </Tooltip>
            </Column>
            <Column
              dataKey="accession"
              defaultKey="proteinFastas"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={ProteinFastasRenderer(entryDB)}
            >
              FASTA
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="proteinAccessions"
              renderer={ProteinAccessionsRenderer(entryDB)}
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
    const {
      data: { payload, loading },
      customLocation,
    } = this.props;
    return (
      <SummaryAsync
        data={payload}
        customLocation={customLocation}
        loading={loading}
      />
    );
  }
}

const subPagesForOrganism = new Map();
for (const subPage of config.pages.organism.subPages) {
  subPagesForOrganism.set(subPage, subPages.get(subPage));
}

// const _Title = ({ data: { loading, payload } }) =>
//   loading ? (
//     <Loading />
//   ) : (
//     <Title metadata={payload.metadata} mainType="organism" />
//   );
// _Title.propTypes = {
//   data: T.shape({
//     loading: T.bool,
//     payload: T.object,
//   }).isRequired,
// };

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

const locationSelector1 = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0] ||
    (customLocation.description[key].accession &&
      customLocation.description[key].proteomeDB)
  );
}, value => value);

class _Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
    }).isRequired,
    dataOrganism: T.shape({
      loading: T.bool.isRequired,
    }).isRequired,
    dataBase: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
    customLocation: T.object.isRequired,
  };

  render() {
    const {
      data: { loading, payload },
      dataOrganism: { loading: loadingOrg, payload: payloadOrg },
      dataBase,
    } = this.props;
    if (loading || !payload) {
      return <Loading />;
    }
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    return (
      <Fragment>
        {payloadOrg &&
          payloadOrg.metadata &&
          payloadOrg.metadata.accession && (
            <Fragment>
              <SchemaOrgData
                data={{
                  data: payloadOrg,
                  endpoint: 'organism',
                  version: databases && databases.uniprot.version,
                }}
                processData={schemaProcessDataRecord}
              />
              <SchemaOrgData
                data={{
                  data: payloadOrg.metadata,
                  type: 'Organism',
                }}
                processData={schemaProcessMainEntity}
              />
            </Fragment>
          )}

        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('medium-12', 'large-12', 'columns')}>
              {/* <LoadedTitle />*/}
              {loadingOrg ? (
                <Loading />
              ) : (
                <Title metadata={payloadOrg.metadata} mainType="organism" />
              )}
              <EntryMenu metadata={payload.metadata} />
            </div>
          </div>
          <Switch
            {...this.props}
            locationSelector={locationSelector1}
            indexRoute={SummaryComponent}
            childRoutes={subPagesForOrganism}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}
const Summary = loadData({
  getUrl: mapStateToAccessionUrl,
  propNamespace: 'Organism',
})(loadData()(_Summary));

const locationSelector2 = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].proteomeAccession ||
    customLocation.description[key].accession ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);

const childRoutes = new Map([[/(UP\d{9})|(\d+)|(all)/i, Summary]]);
// Keep outside! Otherwise will be redefined at each render of the outer Switch
class InnerSwitch extends PureComponent {
  render() {
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={locationSelector2}
          indexRoute={List}
          childRoutes={childRoutes}
          catchAll={List}
        />
      </ErrorBoundary>
    );
  }
}

const locationSelector3 = createSelector(
  customLocation =>
    mainDBLocationSelector(customLocation) ||
    customLocation.description[customLocation.description.main.key].proteomeDB,
  value => value,
);

class Organism extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={locationSelector3}
          indexRoute={Overview}
          catchAll={InnerSwitch}
        />
      </ErrorBoundary>
    );
  }
}

export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  loadData()(Organism),
);
