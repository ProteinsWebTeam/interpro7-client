// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import {
  dataPropType,
  metadataPropType,
} from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
  Card,
  HighlightToggler,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import MemberSymbol from 'components/Entry/MemberSymbol';
import NumberComponent from 'components/NumberComponent';
import File from 'components/File';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { setDBs } from 'utils/processDescription/handlers';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

const f = foundationPartial(
  ebiGlobalStyles,
  fonts,
  pageStyle,
  ipro,
  exporterStyle,
  filtersAndTable,
);

/*:: type Props = {
  entryDB: string,
  metadata: Object,
  counters: Object
};*/
class SummaryCounterSet extends PureComponent /*:: <Props> */ {
  static propTypes = {
    entryDB: T.string,
    metadata: metadataPropType.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;

    const { entries, proteins, structures, taxa, proteomes } = counters;

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
                main: { key: 'set' },
                set: {
                  db: metadata.source_database,
                  accession: metadata.accession.toString(),
                },
                entry: { isFilter: true, db: entryDB && 'all' },
              },
            }}
            disabled={!entries}
          >
            <div className={f('icon-wrapper')}>
              <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />
              {entries !== 0 && (
                <div className={f('icon-over-anim', 'mod-img-pos')} />
              )}
            </div>
            <NumberComponent abbr>{entries}</NumberComponent>
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
                main: { key: 'set' },
                set: {
                  db: metadata.source_database,
                  accession: metadata.accession.toString(),
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
            disabled={!proteins}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x50;"
            >
              {proteins !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{proteins}</NumberComponent>
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
                main: { key: 'set' },
                set: {
                  db: metadata.source_database,
                  accession: `${metadata.accession}`,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x73;"
            >
              {structures !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{structures}</NumberComponent>{' '}
            <span className={f('label-number')}>structures</span>
          </Link>
        </Tooltip>
        <Tooltip
          title={`${taxa} ${toPlural('taxonomy', taxa)} matching ${
            metadata.name
          }`}
          className={f('count-organisms')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'set' },
                set: {
                  db: metadata.source_database,
                  accession: metadata.accession,
                },
                taxonomy: { isFilter: true, db: 'uniprot' },
              },
            }}
            disabled={!taxa}
          >
            <div className={f('icon', 'icon-count-species', 'icon-wrapper')}>
              {taxa !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{taxa}</NumberComponent>
            <span className={f('label-number')}>
              {toPlural('taxonomy', taxa)}
            </span>
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
                main: { key: 'set' },
                set: {
                  db: metadata.source_database,
                  accession: `${metadata.accession}`,
                },
                proteome: { isFilter: true, db: 'uniprot' },
              },
            }}
            disabled={!proteomes}
          >
            <div
              className={f(
                'icon',
                'icon-common',
                'icon-count-proteome',
                'icon-wrapper',
              )}
            >
              {proteomes !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{proteomes}</NumberComponent>{' '}
            <span className={f('label-number')}>proteomes</span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}

const SetCard = (
  {
    data,
    search,
    entryDB,
  } /*: {data: Object, search: string, entryDB: string} */,
) => {
  return (
    <>
      <div className={f('card-header')}>
        <div className={f('card-title')}>
          <h6>
            <Link
              to={{
                description: {
                  main: { key: 'set' },
                  set: {
                    db: data.metadata.source_database,
                    accession: `${data.metadata.accession}`,
                  },
                },
              }}
            >
              <HighlightedText
                text={data.metadata.name}
                textToHighlight={search}
              />
            </Link>
          </h6>
        </div>
      </div>

      <SummaryCounterSet
        entryDB={entryDB}
        metadata={data.metadata}
        counters={
          (data && data.extra_fields && data.extra_fields.counters) || {}
        }
      />

      <div className={f('card-footer')}>
        <div>
          <HighlightedText
            text={data.metadata.accession || ''}
            textToHighlight={search}
          />
        </div>
      </div>
    </>
  );
};

SetCard.propTypes = {
  data: dataPropType,
  search: T.string,
  entryDB: T.string,
};

const propTypes = {
  data: dataPropType.isRequired,
  loading: T.bool,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  dataBase: dataPropType,
};
const AllSetDownload = (
  {
    description,
    search,
    count,
    fileType,
  } /*: {description: Object, search: Object, count: number, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`sets.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={{ ...search, extra_fields: 'counters' }}
    endpoint={'set'}
  />
);
AllSetDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
};

/*:: type ListProps = {
  data: {
   payload: Object,
   loading: boolean,
   ok: boolean,
   url: string,
   status: number
  },
  isStale: boolean,
  loading: boolean,
  customLocation: {
    description: Object,
    search: Object
  },
  dataBase: {
   payload: Object,
   loading: boolean
  }
};*/
class List extends PureComponent /*:: <ListProps> */ {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { description, search },
      dataBase,
    } = this.props;
    let _payload = payload;
    const {
      set: { db: dbS },
      entry: { db: dbE },
    } = description;

    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases = dataBase?.payload?.databases;
    const db = (dbE || dbS).toLowerCase();
    const dbAll = { canonical: 'ALL', name: 'All', version: 'N/A' };
    if (loading || notFound) {
      _payload = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    }
    return (
      <div className={f('row', 'filters-and-table')}>
        <nav>
          <div className={f('browse-side-panel')}>
            <div className={f('selector-container')}>
              <MemberDBSelector
                contentType="set"
                className="pp-left-side-db-selector"
              />
            </div>
            <hr style={{ paddingTop: '0.5rem' }} />
          </div>
        </nav>
        <section>
          {databases && (
            <SchemaOrgData
              data={{
                data: {
                  db: db.toLowerCase() === 'all' ? dbAll : databases[db],
                },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}

          <Table
            dataTable={_payload.results}
            contentType="set"
            loading={loading}
            ok={ok}
            status={status}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            databases={databases}
            nextAPICall={_payload.next}
            previousAPICall={_payload.previous}
            currentAPICall={url}
          >
            <Exporter>
              <div className={f('menu-grid')}>
                <label htmlFor="json">JSON</label>
                <AllSetDownload
                  name="json"
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="json"
                />
                <label htmlFor="tsv">TSV</label>
                <AllSetDownload
                  name="tsv"
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="tsv"
                />
                <label htmlFor="api">API</label>
                <Link
                  name="api"
                  target="_blank"
                  href={url}
                  className={f('button', 'hollow', 'imitate-progress-button')}
                >
                  <span
                    className={f('icon', 'icon-common', 'icon-export')}
                    data-icon="&#xf233;"
                  />
                  <span className={f('file-label')}>Web View</span>
                </Link>
              </div>
            </Exporter>
            <PageSizeSelector />
            <Card>
              {(data) => (
                <SetCard data={data} search={search.search} entryDB={dbE} />
              )}
            </Card>
            <SearchBox loading={isStale}>Search entry sets</SearchBox>
            <HighlightToggler />
            <Column
              dataKey="accession"
              // eslint-disable-next-line camelcase
              renderer={(accession /*: string */, row) => (
                <Link
                  to={(customLocation) => ({
                    ...customLocation,
                    description: {
                      main: { key: 'set' },
                      set: {
                        db: row.source_database,
                        accession,
                      },
                    },
                  })}
                >
                  <span className={f('acc-row')}>
                    <SchemaOrgData
                      data={{
                        data: { row, endpoint: 'set' },
                        location: window.location,
                      }}
                      processData={schemaProcessDataTableRow}
                    />
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
                {
                  accession,
                  // eslint-disable-next-line camelcase
                  source_database: db,
                } /*: {accession: string, source_database: string} */,
              ) => (
                <Link
                  to={(customLocation) => ({
                    ...customLocation,
                    description: {
                      main: { key: 'set' },
                      set: {
                        db,
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
            <Column
              dataKey="accession"
              defaultKey="entry-count"
              renderer={(
                accession /*: string */,
                {
                  source_database: sourceDB,
                } /*: {accession: string, source_database: string} */,
                extra,
              ) => {
                const count =
                  (extra && extra.counters && extra.counters.entries) || '-';
                return (
                  <Link
                    to={(customLocation) => ({
                      ...customLocation,
                      description: {
                        main: { key: 'set' },
                        set: {
                          db: sourceDB,
                          accession,
                        },
                        entry: {
                          isFilter: true,
                          db: sourceDB,
                        },
                      },
                    })}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
                );
              }}
            >
              Number of Entries
            </Column>
            <Column
              dataKey="source_database"
              renderer={(
                accession /*: string */,
                {
                  source_database: sourceDB,
                } /*: {accession: string, source_database: string} */,
              ) => {
                return <div>{databases?.[sourceDB]?.name}</div>;
              }}
            >
              Source Database
            </Column>
          </Table>
        </section>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "set-summary" */ 'components/Set/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForSet = new Map();
for (const subPage of config.pages.set.subPages) {
  subPagesForSet.set(subPage, subPages.get(subPage));
}

const dbAccs = new RegExp(
  Array.from(setDBs)
    .map((db) => db.re.source)
    .filter((db) => db)
    .join('|'),
  'i',
);

const EntrySet = () => (
  <EndPointPage
    subpagesRoutes={dbAccs}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForSet}
  />
);

export default EntrySet;
