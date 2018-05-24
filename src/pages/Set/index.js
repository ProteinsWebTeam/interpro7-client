import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

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

import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, pageStyle, ipro);

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
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }),
};

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: {
        description: {
          set: { db: dbS },
          entry: { db: dbE },
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
    const db = (dbE || dbS).toLowerCase();
    const dbAll = { canonical: 'ALL', name: 'All', version: 'N/A' };
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBSelector contentType="set" className="left-side-db-selector" />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <hr />
          {databases && (
            <SchemaOrgData
              data={{
                data: { db: db === 'ALL' ? dbAll : databases[db] },
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
              renderer={(accession /*: string */, row) => (
                <Link
                  to={customLocation => ({
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

const subPagesForSet = new Map();
for (const subPage of config.pages.set.subPages) {
  subPagesForSet.set(subPage, subPages.get(subPage));
}

const dbAccs = new RegExp(
  Array.from(setDBs)
    .map(db => db.re.source)
    .filter(db => db)
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
