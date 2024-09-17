import React, { useEffect } from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Callout from 'components/SimpleCommonComponents/Callout';

import Link from 'components/generic/Link';

import GoLink from 'components/ExtLink/GoLink';
import MemberDBSelector from 'components/MemberDBSelector';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import File from 'components/File';

import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';

import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import getExtUrlFor from 'utils/url-patterns';
import loadWebComponent from 'utils/load-web-component';
import loadable from 'higherOrder/loadable';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { memberDBAccessions } from 'staticData/home';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';
import EntryCard from 'components/Entry/Card';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import cssBinder from 'styles/cssBinder';

import { toPublicAPI } from 'utils/url';

const css = cssBinder(
  pageStyle,
  ebiStyles,
  fonts,
  exporterStyle,
  filtersAndTable,
);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

const GO_COLORS = new Map([
  ['P', '#d1eaef'],
  ['F', '#e0f2d1'],
  ['C', '#f5ddd3'],
]);

type ArchiveProps = { name: string; page: string };

const ArchiveCallout = ({ name, page }: ArchiveProps) => (
  <div className={css('row')}>
    <div className={css('columns', 'large-12')}>
      <Callout type="info">
        <p>
          <strong>{name} has retired</strong>
          <br />
          While {name} is no longer receiving updates, InterPro now serves as an
          archival source, granting continued access to its data.
          <br />
          Further information about {name} can be found{' '}
          <Link
            href={`${config.root.readthedocs.href + page}.html`}
            className={css('ext')}
            target="_blank"
          >
            in our documentation
          </Link>
          .
        </p>
      </Callout>
    </div>
  </div>
);

type AllEntriesDownloadProps = {
  description: object;
  search: InterProLocationSearch;
  count: number;
  fileType: DownloadFileTypes;
  name: string;
};

const AllEntriesDownload = ({
  description,
  search,
  count,
  fileType,
  name,
}: AllEntriesDownloadProps) => (
  <File
    fileType={fileType}
    name={name || `entries.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={search}
    endpoint={'entry'}
  />
);

type EntryExtra = {
  short_name: string;
  counters: MetadataCounters;
  literature?: Record<string, Reference>;
};
type EntryItem = {
  metadata: EntryMetadata;
  extra_fields?: EntryExtra;
  search: string;
  entryDB: MemberDB | 'interpro';
};

type Props = {
  customLocation?: InterProLocation;
};

interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteinEntryPayload>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({ data, customLocation, isStale, dataBase }: LoadedProps) => {
  useEffect(() => {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }, []);

  if (!data || !customLocation) return null;

  const { payload } = data;
  const { description, search } = customLocation;
  let _payload = payload;
  const db = description.entry.db as MemberDB | 'interpro' | 'InterPro';

  const HTTP_OK = 200;
  const notFound = !data.loading && data.status !== HTTP_OK;
  const databases = dataBase?.payload?.databases;
  const isStaleButShouldntDisplayStale =
    isStale &&
    // eslint-disable-next-line camelcase
    _payload?.results?.[0]?.metadata?.source_database?.toLowerCase() !==
      db.toLowerCase();

  if (data.loading || notFound || isStaleButShouldntDisplayStale) {
    _payload = { results: [], count: 0 };
  }

  const includeGrid = data.url;
  const shouldShowMemberDBSelector = db?.toLowerCase() !== 'interpro';

  const size = _payload?.count || 0;

  return (
    <div className={css('row', 'filters-and-table')}>
      <nav>
        <div className={css('browse-side-panel')}>
          {shouldShowMemberDBSelector && (
            <>
              <div className={css('selector-container')}>
                <MemberDBSelector
                  contentType="entry"
                  className="pp-left-side-db-selector"
                />
              </div>
              <hr style={{ paddingTop: '0.5rem' }} />
            </>
          )}
          <EntryListFilter />
        </div>
      </nav>

      <section>
        {databases && db && databases[db.toLowerCase()] && (
          <SchemaOrgData
            data={{
              data: { db: databases[db.toLowerCase()] },
              location: window.location,
            }}
            processData={schemaProcessDataTable}
          />
        )}
        {db && ['prints', 'sfld'].includes(db) ? (
          <ArchiveCallout name={db.toUpperCase()} page={db.toLowerCase()} />
        ) : null}
        <Table
          dataTable={_payload?.results}
          contentType="entry"
          loading={data.loading}
          ok={data.ok}
          status={data.status}
          isStale={isStale}
          actualSize={size}
          query={search}
          notFound={notFound}
          withGrid={!!includeGrid}
          databases={databases}
          nextAPICall={_payload?.next}
          previousAPICall={_payload?.previous}
          currentAPICall={data.url}
        >
          <Exporter>
            <div className={css('menu-grid')}>
              <AllEntriesDownload
                description={description}
                search={search}
                count={size}
                fileType="json"
                name="json"
              />
              <AllEntriesDownload
                description={description}
                search={search}
                count={size}
                fileType="tsv"
                name="tsv"
              />
              <ExternalExportButton type={'api'} url={toPublicAPI(data.url)} />
              <ExternalExportButton
                search={search}
                type={'scriptgen'}
                subpath={descriptionToPath(description)}
              />
            </div>
          </Exporter>
          <PageSizeSelector />
          <Card>
            {(data: EntryItem) => (
              <EntryCard
                data={data}
                search={search.search as string}
                entryDB={db}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search entries</SearchBox>
          <HighlightToggler />
          {db === 'InterPro' && (
            <Column
              dataKey="type"
              headerClassName={css('col-type', 'table-center')}
              cellClassName={css('table-center')}
              renderer={(type: string) => {
                const _type = type.replace('_', ' ');
                return (
                  <Tooltip title={`${_type} type`}>
                    <interpro-type type={_type} dimension="26px" />
                  </Tooltip>
                );
              }}
            />
          )}
          <Column
            dataKey="accession"
            isSortable={true}
            renderer={(accession: string, row: unknown) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    ...customLocation.description,
                    entry: {
                      ...customLocation.description.entry,
                      accession,
                    },
                  },
                })}
              >
                <SchemaOrgData
                  data={{
                    data: { row, endpoint: 'entry' },
                    location: window.location,
                  }}
                  processData={schemaProcessDataTableRow}
                />
                <span className={css('acc-row')}>
                  <HighlightedText
                    text={accession || ''}
                    textToHighlight={search.search as string}
                  />
                </span>
              </Link>
            )}
          >
            Accession
          </Column>

          <Column
            dataKey="counters.extra_fields.short_name"
            renderer={(_, meta, extra?: EntryExtra) =>
              extra?.short_name ? (
                <Link
                  to={(customLocation) => ({
                    description: {
                      ...customLocation.description,
                      entry: {
                        ...customLocation.description.entry,
                        accession: meta.accession,
                      },
                    },
                    search: {},
                  })}
                >
                  <HighlightedText
                    text={extra.short_name}
                    textToHighlight={search.search as string}
                  />
                </Link>
              ) : null
            }
          >
            Short name
          </Column>

          <Column
            dataKey="name"
            renderer={(name: string, { accession }: EntryMetadata) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    ...customLocation.description,
                    entry: {
                      ...customLocation.description.entry,
                      accession: accession,
                    },
                  },
                  search: {},
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

          {db !== 'InterPro' && (
            <Column
              dataKey="type"
              headerClassName={css('col-type', 'table-center')}
              cellClassName={css('table-center')}
              renderer={(type: string) => (
                <Tooltip
                  title={`${type.replace('_', ' ')} type (as defined by ${
                    (databases && databases[db] && databases[db].name) || db
                  })`}
                >
                  {type.replace('_', ' ')}
                </Tooltip>
              )}
            >
              {`${db} Type`}
            </Column>
          )}

          {db !== 'InterPro' && (
            <Column
              dataKey="source_database"
              headerClassName={css('table-center')}
              cellClassName={css('table-center')}
              renderer={(
                db: MemberDB | 'interpro' | 'all',
                { accession }: EntryMetadata,
              ) => {
                const externalLinkRenderer = getExtUrlFor(db);
                const symbol = (
                  <MemberSymbol type={db} className={css('md-small')} />
                );
                if (db.toLowerCase() === 'pfam' || !externalLinkRenderer)
                  return symbol;
                return (
                  <Tooltip
                    title={`link to ${accession} on the ${
                      (databases && databases[db] && databases[db].name) || db
                    } website`}
                    distance={-5}
                    useContext={true}
                  >
                    <Link
                      target="_blank"
                      href={externalLinkRenderer(accession)}
                      style={{ borderBottomWidth: 0 }}
                    >
                      {symbol}
                    </Link>
                  </Tooltip>
                );
              }}
            >
              DB
            </Column>
          )}
          {db === 'InterPro' ? (
            <Column
              dataKey="member_databases"
              cellClassName={css('col-md')}
              renderer={(memberDataBases: ProteinEntryPayload) => (
                <div className={css('signature-container')}>
                  {memberDataBases &&
                    Object.entries(memberDataBases).map(([db, entries]) =>
                      Object.entries(entries).map(([accession, id]) => (
                        <Tooltip
                          key={accession}
                          title={`${id} (${
                            (databases &&
                              databases[db] &&
                              databases[db].name) ||
                            db
                          })`}
                          className={css('signature', {
                            'corresponds-to-filter':
                              search.signature_in &&
                              (search.signature_in as string).toLowerCase() ===
                                db.toLowerCase(),
                          })}
                        >
                          <Link
                            to={{
                              description: {
                                main: { key: 'entry' },
                                entry: { db, accession },
                              },
                            }}
                          >
                            {accession}
                          </Link>
                        </Tooltip>
                      )),
                    )}
                </div>
              )}
            >
              Integrated Signature(s)
            </Column>
          ) : (
            <Column
              dataKey="integrated"
              headerClassName={css('table-center')}
              renderer={(accession: string) =>
                accession ? (
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: { db: 'InterPro', accession },
                      },
                      search: {},
                    }}
                  >
                    <Tooltip title={`${accession}`}>{accession}</Tooltip>
                  </Link>
                ) : (
                  ''
                )
              }
            >
              Integrated Into
            </Column>
          )}

          {
            // TODO re-insert GO terms as column in table for Member databases when data available
          }

          {db === 'InterPro' ? (
            <Column
              dataKey="go_terms"
              headerClassName={css('col-go-head')}
              cellClassName={css('col-go')}
              renderer={(goTerms: GOTerm[]) => (
                <div className={css('go-container')}>
                  {goTerms &&
                    Array.from(goTerms)
                      .sort((a, b) => {
                        if (a.category.code > b.category.code) return 0;
                        if (a.category.code < b.category.code) return 1;
                        if (a.name > b.name) return 1;
                        return 0;
                      })
                      .map((go) => (
                        <span key={go.identifier} className={css('go-list')}>
                          <Tooltip
                            title={`${go.category.name.replace('_', ' ')} term`}
                          >
                            <span
                              className={css('go-circle')}
                              style={{
                                background:
                                  GO_COLORS.get(go.category.code) || '#ddd',
                              }}
                            />
                          </Tooltip>
                          <Tooltip title={`${go.name} (${go.identifier})`}>
                            <GoLink id={go.identifier} className={css('ext')}>
                              {go.name ? go.name : 'None'}
                            </GoLink>
                          </Tooltip>
                        </span>
                      ))}
                </div>
              )}
            >
              GO Terms{' '}
              <Tooltip title="Biological process category">
                <span className={css('sign-label-head', 'bp')}>BP</span>
              </Tooltip>{' '}
              <Tooltip title="Molecular function category">
                <span className={css('sign-label-head', 'mf')}>MF</span>
              </Tooltip>{' '}
              <Tooltip title="Cellular component category">
                <span className={css('sign-label-head', 'cc')}>CC</span>
              </Tooltip>
            </Column>
          ) : null}
        </Table>
      </section>
    </div>
  );
};

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-summary" */ 'components/Entry/Summary'),
  loading: () => null,
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForEntry = new Map();
for (const subPage of config.pages.entry.subPages) {
  subPagesForEntry.set(subPage, subPages.get(subPage));
}

const childRoutesReg = new RegExp(
  `(${memberDBAccessions.join('|')}|IPR[0-9]{6})`,
  'i',
);

const Entry = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForEntry}
  />
);

export default Entry;
