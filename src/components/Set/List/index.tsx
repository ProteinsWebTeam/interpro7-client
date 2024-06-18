import React from 'react';

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
import SetCard from 'components/Set/Card';
import NumberComponent from 'components/NumberComponent';
import APIViewButton from 'components/Table/Exporter/APIViewButton';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import pageStyle from 'pages/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';
import AllSetDownload from './AllSetDownload';

const f = cssBinder(
  //   ebiGlobalStyles,
  fonts,
  pageStyle,
  //   ipro,
  exporterStyle,
  filtersAndTable,
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type Props = {
  customLocation?: InterProLocation;
};

type SetItem = { metadata: SetMetadata };
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<SetItem>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({ data, isStale, customLocation, dataBase }: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { payload, loading, ok, url, status } = data;
  const { description, search } = customLocation;
  let _payload = payload;
  const {
    set: { db: dbS },
    entry: { db: dbE },
  } = description;

  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  const databases = dataBase?.payload?.databases;
  const db = (dbE || dbS || '').toLowerCase();
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
              // @ts-expect-error until MemberDB selector is migrated
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

        <Table<SetItem>
          dataTable={_payload!.results}
          contentType="set"
          loading={loading}
          ok={ok}
          status={status}
          isStale={isStale}
          actualSize={_payload!.count}
          query={search}
          notFound={notFound}
          databases={databases}
          nextAPICall={_payload!.next}
          previousAPICall={_payload!.previous}
          currentAPICall={url}
        >
          <Exporter>
            <div className={f('menu-grid')}>
              <label htmlFor="json">JSON</label>
              <AllSetDownload
                name="json"
                description={description}
                search={search}
                count={_payload!.count}
                fileType="json"
              />
              <label htmlFor="tsv">TSV</label>
              <AllSetDownload
                name="tsv"
                description={description}
                search={search}
                count={_payload!.count}
                fileType="tsv"
              />
              <label htmlFor="api">API</label>
              <APIViewButton url={url} />
            </div>
          </Exporter>
          <PageSizeSelector />
          <Card>
            {(data: SetItem) => (
              <SetCard
                data={data}
                search={search.search as string}
                entryDB={dbE as MemberDB | 'interpro'}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search entry sets</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            isSortable={true}
            // eslint-disable-next-line camelcase
            renderer={(accession: string, row) => (
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
                    textToHighlight={search.search as string}
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
              name: string,
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
                  textToHighlight={search.search as string}
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
              accession: string,
              { source_database: sourceDB },
              extra?: { counters?: { entries?: number | { total?: number } } },
            ) => {
              const count =
                (typeof extra?.counters?.entries === 'number'
                  ? extra.counters.entries
                  : extra?.counters?.entries?.total) || '-';
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
              _accession: string,
              { source_database: sourceDB }: SetMetadata,
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
};

export default List;
