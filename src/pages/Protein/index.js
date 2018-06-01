import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
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

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, pageStyle, ebiStyles, ipro);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

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
  }).isRequired,
};

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search },
      // customLocation: { description: { protein: { db } }, search },
      dataBase,
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    const db = 'uniprot';
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="protein"
          className="left-side-db-selector"
        />

        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          <ProteinListFilters />
          <hr />
          {databases &&
            db &&
            databases[db.toLowerCase()] && (
              <SchemaOrgData
                data={{
                  data: { db: databases[db.toLowerCase()] },
                  location: window.location,
                }}
                processData={schemaProcessDataTable}
              />
            )}
          <Table
            dataTable={_payload.results}
            contentType="protein"
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
              renderer={(accession /*: string */, row) => (
                <Fragment>
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'protein' },
                      location: window.location,
                    }}
                    processData={schemaProcessDataTableRow}
                  />
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
                  {row.source_database === 'reviewed' ? (
                    <Fragment>
                      {'\u00A0' /* non-breakable space */}
                      <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                        <span
                          className={f('icon', 'icon-functional')}
                          data-icon="/"
                          aria-label="reviewed"
                        />
                      </Tooltip>
                    </Fragment>
                  ) : null}
                </Fragment>
              )}
            />

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
              renderer={({ fullName, taxId }) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        db: 'uniprot',
                        accession: `${taxId}`,
                      },
                    },
                  }}
                >
                  {fullName}
                </Link>
              )}
            >
              Species
            </Column>
            <Column
              dataKey="length"
              headerClassName={f('text-right')}
              cellClassName={f('text-right')}
              renderer={(length /*: number */) => (
                <Tooltip title={`${length.toLocaleString()} amino acids`}>
                  <span aria-label="amino acids length">
                    {length.toLocaleString()}
                  </span>
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

const subPagesForProtein = new Map();
for (const subPage of config.pages.protein.subPages) {
  subPagesForProtein.set(subPage, subPages.get(subPage));
}

const childRoutesReg = /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;

const Protein = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForProtein}
  />
);

export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('domain_architecture', 'entry')
    .replace('sequence', ''),
)(Protein);
