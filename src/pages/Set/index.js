// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

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
import SetCard from 'components/Set/Card';
import NumberComponent from 'components/NumberComponent';
// $FlowFixMe
import File from 'components/File';
// $FlowFixMe
import APIViewButton from 'components/Table/Exporter/APIViewButton';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { setDBs } from 'utils/processDescription/handlers';

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
    search={{ ...search, extra_fields: 'counters:entry-protein' }}
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
                <APIViewButton url={url} />
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
    // $FlowFixMe
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
