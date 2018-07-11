import React, { PureComponent } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import { GoLink } from 'components/ExtLink';
import Description from 'components/Description';
import MemberDBSelector from 'components/MemberDBSelector';
import EntryListFilter from 'components/Entry/EntryListFilters';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Loading from 'components/SimpleCommonComponents/Loading';

import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import { NumberComponent } from 'components/NumberLabel';

import getExtUrlFor from 'utils/url-patterns';
import { toPlural } from 'utils/pages';
import loadWebComponent from 'utils/load-web-component';
import loadable from 'higherOrder/loadable';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { memberDBAccessions } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(pageStyle, ebiStyles, fonts);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

const GO_COLORS = new Map([
  ['P', '#d1eaef'],
  ['F', '#e0f2d1'],
  ['C', '#f5ddd3'],
]);

class SummaryCounterEntries extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    metadata: T.object.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;
    const {
      proteins,
      domain_architectures: domainArchitectures,
      taxa,
      structures,
      sets,
    } = counters;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${proteins} ${toPlural('protein', proteins)} matching ${
            metadata.name
          }`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x50;" />{' '}
            <NumberComponent value={proteins} abbr />
            <span className={f('label-number')}>
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${domainArchitectures} domain architectures matching ${
            metadata.name
          }`}
          className={f('count-architectures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                  detail: 'domain_architecture',
                },
              },
            }}
            disabled={!domainArchitectures}
          >
            <div className={f('icon', 'icon-count-ida')} />{' '}
            <NumberComponent value={domainArchitectures} abbr />
            <span className={f('label-number')}>domain architectures</span>
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
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                taxonomy: { isFilter: true, db: 'uniprot' },
              },
            }}
            disabled={!taxa}
          >
            <div className={f('icon', 'icon-count-species')} />{' '}
            <NumberComponent value={taxa} abbr />
            <span className={f('label-number')}>
              {toPlural('taxonomy', taxa)}
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
                main: { key: 'entry' },
                entry: {
                  db: entryDB,
                  accession: metadata.accession,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="s" />{' '}
            <NumberComponent value={structures} abbr />
            <span className={f('label-number')}>
              {toPlural('structure', structures)}
            </span>
          </Link>
        </Tooltip>

        {// show sets counter + icon only when available
        entryDB.toLowerCase() === 'cdd' || entryDB.toLowerCase() === 'pfam' ? (
          <Tooltip
            title={`${sets} ${toPlural('set', sets)} matching ${metadata.name}`}
            className={f('count-sets')}
            style={{ display: 'flex' }}
          >
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: entryDB,
                    accession: metadata.accession,
                  },
                  set: { isFilter: true, db: entryDB },
                },
              }}
              disabled={!sets}
            >
              <div className={f('icon', 'icon-count-set')} />{' '}
              <NumberComponent value={sets} abbr />
              <span className={f('label-number')}>{toPlural('set', sets)}</span>
            </Link>
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

const description2IDs = description =>
  (description.match(/"(PUB\d+)"/gi) || []).map(t =>
    t.replace(/(^")|("$)/g, ''),
  );

class DescriptionEntries extends PureComponent {
  static propTypes = {
    description: T.arrayOf(T.string),
    literature: T.object,
    db: T.string.isRequired,
    accession: T.string.isRequired,
  };

  render() {
    const { description, literature, db, accession } = this.props;

    if (!(description && description.length)) return null;

    const desc = description[0];

    const citations = description2IDs(desc);
    const included = Object.entries(literature)
      .filter(([id]) => citations.includes(id))
      .sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));

    return (
      <React.Fragment>
        <div className={f('card-description', 'card-block')}>
          <Description
            textBlocks={[desc]}
            literature={included}
            accession={accession}
            withoutIDs
          />
        </div>
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db, accession },
            },
          }}
          className={f('card-description-link')}
        >
          […]
        </Link>
      </React.Fragment>
    );
  }
}

class EntryCard extends PureComponent {
  static propTypes = {
    data: T.object,
    search: T.string,
    entryDB: T.string,
  };

  render() {
    const { data, search, entryDB } = this.props;
    return (
      <React.Fragment>
        <div className={f('card-header')}>
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: data.metadata.source_database,
                  accession: data.metadata.accession,
                },
              },
            }}
          >
            {entryDB.toLowerCase() === 'interpro' ? (
              <Tooltip title={`${data.metadata.type.replace('_', ' ')} type`}>
                <interpro-type
                  dimension="2em"
                  type={data.metadata.type.replace('_', ' ')}
                  aria-label="Entry type"
                />
              </Tooltip>
            ) : (
              <Tooltip title={`${entryDB} database`}>
                <MemberSymbol
                  size="2em"
                  type={entryDB}
                  aria-label="Database type"
                  className={f('md-small')}
                />
              </Tooltip>
            )}
            <h6>
              <HighlightedText
                text={data.metadata.name}
                textToHighlight={search}
              />
            </h6>
          </Link>
        </div>

        {data.extra_fields ? (
          <SummaryCounterEntries
            entryDB={entryDB}
            metadata={data.metadata}
            counters={data.extra_fields.counters}
          />
        ) : (
          <Loading />
        )}
        {data.extra_fields ? (
          <DescriptionEntries
            db={data.metadata.source_database}
            accession={data.metadata.accession}
            description={data.extra_fields.description}
            literature={data.extra_fields.literature}
          />
        ) : (
          <Loading />
        )}
        <div className={f('card-footer')}>
          {entryDB.toLowerCase() === 'interpro' ? (
            <div>{data.metadata.type.replace('_', ' ')}</div>
          ) : (
            <div>
              {data.metadata.integrated ? 'Integrated to ' : 'Not integrated'}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: 'InterPro',
                      accession: data.metadata.integrated,
                    },
                  },
                }}
                disabled={!data.metadata.integrated}
              >
                {data.metadata.integrated}
              </Link>
            </div>
          )}
          <div>
            {' '}
            <HighlightedText
              text={data.metadata.accession}
              textToHighlight={search}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class List extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
      ok: T.bool,
    }).isRequired,
    isStale: T.bool.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    dataBase: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
    }),
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const {
      data,
      isStale,
      customLocation: {
        description: {
          entry: { db },
        },
        search,
      },
      dataBase,
    } = this.props;
    let _payload = data.payload;
    const HTTP_OK = 200;
    const notFound = !data.loading && data.status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (data.loading || notFound) {
      _payload = { results: [] };
    }
    const urlHasParameter = data.url && data.url.includes('?');
    const includeGrid = data.url;
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="entry"
          className="pp-left-side-db-selector"
        />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <EntryListFilter />
          <hr />
          {databases &&
            db &&
            databases[db.toUpperCase()] && (
              <SchemaOrgData
                data={{
                  data: { db: databases[db.toUpperCase()] },
                  location: window.location,
                }}
                processData={schemaProcessDataTable}
              />
            )}
          <Table
            dataTable={_payload.results}
            contentType="entry"
            loading={data.loading}
            ok={data.ok}
            status={data.status}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withGrid={!!includeGrid}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={data.url} download="entries.json">
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${data.url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="entries.tsv"
                  >
                    TSV
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href={data.url}>
                    Open in API web view
                  </Link>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <Card>
              {data => (
                <EntryCard data={data} search={search.search} entryDB={db} />
              )}
            </Card>
            <SearchBox>Search entries</SearchBox>
            {db === 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={type => {
                  const _type = type.replace('_', ' ');
                  return (
                    <Tooltip title={`${_type} type`}>
                      <interpro-type type={_type} dimension="26px">
                        {_type}
                      </interpro-type>
                    </Tooltip>
                  );
                }}
              />
            )}
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <Link
                  to={customLocation => ({
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
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={customLocation => ({
                    description: {
                      ...customLocation.description,
                      entry: {
                        ...customLocation.description.entry,
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

            {db !== 'InterPro' && (
              <Column
                dataKey="type"
                headerClassName={f('col-type', 'table-center')}
                cellClassName={f('table-center')}
                renderer={type => (
                  <Tooltip
                    title={`${type.replace(
                      '_',
                      ' ',
                    )} type (as defined by ${db})`}
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
                headerClassName={f('table-center')}
                cellClassName={f('table-center')}
                renderer={(db /*: string */, { accession }) => {
                  const externalLinkRenderer = getExtUrlFor(db);
                  const symbol = (
                    <MemberSymbol type={db} className={f('md-small')} />
                  );
                  if (!externalLinkRenderer) return symbol;
                  return (
                    <Tooltip
                      title={`link to ${accession} on the ${db} website`}
                    >
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href={externalLinkRenderer(accession)}
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
                cellClassName={f('col-md')}
                renderer={(memberDataBases /*: object */) => (
                  <div className={f('signature-container')}>
                    {memberDataBases &&
                      Object.entries(memberDataBases).map(([db, entries]) =>
                        Object.entries(entries).map(([accession, id]) => (
                          <Tooltip
                            key={accession}
                            title={`${id} (${db})`}
                            className={f('signature', {
                              'corresponds-to-filter':
                                search.signature_in &&
                                search.signature_in.toLowerCase() ===
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
                Member Database
              </Column>
            ) : (
              <Column
                dataKey="integrated"
                renderer={(accession /*: string */) =>
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
                Integrated
              </Column>
            )}

            {
              // TODO re-insert GO terms as column in table for Member databases when data available
            }

            {db === 'InterPro' ? (
              <Column
                dataKey="go_terms"
                headerClassName={f('col-go-head')}
                cellClassName={f('col-go')}
                renderer={(goTerms /*: Array<Object> */) => (
                  <div className={f('go-container')}>
                    {goTerms &&
                      Array.from(goTerms)
                        .sort((a, b) => {
                          if (a.category.code > b.category.code) return 0;
                          if (a.category.code < b.category.code) return 1;
                          if (a.name > b.name) return 1;
                          return 0;
                        })
                        .map(go => (
                          <span key={go.identifier} className={f('go-list')}>
                            <Tooltip
                              title={`${go.category.name.replace(
                                '_',
                                ' ',
                              )} term`}
                            >
                              <span
                                className={f('go-circle')}
                                style={{
                                  background:
                                    GO_COLORS.get(go.category.code) || '#ddd',
                                }}
                              />
                            </Tooltip>
                            <Tooltip title={`${go.name} (${go.identifier})`}>
                              <GoLink id={go.identifier} className={f('ext')}>
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
                  <span className={f('sign-label-head', 'bp')}>BP</span>
                </Tooltip>{' '}
                <Tooltip title="Molecular function category">
                  <span className={f('sign-label-head', 'mf')}>MF</span>
                </Tooltip>{' '}
                <Tooltip title="Cellular component category">
                  <span className={f('sign-label-head', 'cc')}>CC</span>
                </Tooltip>
              </Column>
            ) : null}
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "entry-summary" */ 'components/Entry/Summary'),
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
