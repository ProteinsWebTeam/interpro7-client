/* eslint-disable react/display-name */
// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Link from 'components/generic/Link';
// import MemberDBSelector from 'components/MemberDBSelector';
// import ProteomeListFilters from 'components/Proteome/ProteomeListFilters';

import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
  Card,
  HighlightToggler,
} from 'components/Table';
// $FlowFixMe
import File from 'components/File';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';
import ProteomeCard from 'components/Proteome/Card';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const f = foundationPartial(
  ebiGlobalStyles,
  pageStyle,
  styles,
  fonts,
  exporterStyle,
);

const EntryAccessionsRenderer = (entryDB) => (accession, _row, extra) => (
  <File
    fileType="accession"
    name={`${entryDB || 'all'}-entry-accessions-for-${accession}.txt`}
    count={extra && extra.counters && extra.counters.entries}
    customLocationDescription={{
      main: { key: 'entry' },
      entry: { db: entryDB || 'all' },
      proteome: { isFilter: true, db: 'UniProt', accession },
    }}
  />
);

const ProteinFastasRenderer = (entryDB) => (accession, _row, extra) => (
  <File
    fileType="fasta"
    name={`protein-sequences${
      entryDB ? `-matching-${entryDB}` : ''
    }-for-${accession}.fasta`}
    count={extra && extra.counters && extra.counters.proteins}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      entry: { isFilter: true, db: entryDB || 'all' },
      proteome: { isFilter: true, db: 'UniProt', accession },
    }}
  />
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const SummaryAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "proteome-summary" */ 'components/Proteome/Summary'
    ),
});

const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType,
};

const subPagesForProteome = new Map();
for (const subPage of config.pages.proteome.subPages) {
  subPagesForProteome.set(subPage, subPages.get(subPage));
}

const AllProteomesDownload = (
  {
    description,
    search,
    count,
    fileType,
  } /*: {description: Object, search: Object, count: number, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`proteomes.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={{ ...search, extra_fields: 'counters' }}
    endpoint={'proteome'}
  />
);
AllProteomesDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
};

/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
   ok: boolean,
   url: string,
   status: number
  },
  isStale: boolean,
  customLocation: {
    description: Object,
    search: Object
  },
  dataBase: {
   payload: Object,
   loading: boolean
  }
};*/
class List extends PureComponent /*:: <Props> */ {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search, description },
      dataBase,
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    const {
      entry: { db: entryDB },
    } = description;
    if (loading || notFound) {
      _payload = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    }
    return (
      <div className={f('row')}>
        {/* <div
          className={f(
            'columns',
            'small-12',
            'medium-3',
            'large-2',
            'no-padding',
          )}
        >
          <div className={f('browse-side-panel')}>
            <div className={f('selector-container')}>
              <MemberDBSelector
                contentType="proteome"
                className="pp-left-side-db-selector"
              />
            </div>
            <hr style={{ paddingTop: '0.5rem' }} />
          </div>
        </div> */}
        <div className={f('columns')}>
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
                <AllProteomesDownload
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="json"
                  name="json"
                />
                <label htmlFor="tsv">TSV</label>
                <AllProteomesDownload
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="tsv"
                  name="tsv"
                />
                <label htmlFor="api">API</label>
                <Link
                  target="_blank"
                  href={url}
                  className={f('button', 'hollow', 'imitate-progress-button')}
                  name="api"
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
                <ProteomeCard
                  data={data}
                  search={search.search}
                  entryDB={entryDB}
                />
              )}
            </Card>
            <SearchBox loading={isStale}>Search organism</SearchBox>
            <HighlightToggler />
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <Link
                  to={(customLocation) => ({
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
                  to={(customLocation) => ({
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
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.entries) || '-';
                return (
                  <Link
                    className={f('no-decoration')}
                    to={{
                      description: {
                        main: { key: 'proteome' },
                        proteome: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        entry: { isFilter: true, db: entryDB || 'all' },
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
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
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.proteins) || '-';
                return (
                  <Link
                    to={{
                      description: {
                        main: { key: 'proteome' },
                        proteome: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        protein: { isFilter: true, db: 'UniProt', order: 1 },
                        entry: entryDB
                          ? { isFilter: true, db: entryDB, order: 2 }
                          : null,
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
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
              renderer={ProteinFastasRenderer(entryDB)}
            >
              FASTA
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
