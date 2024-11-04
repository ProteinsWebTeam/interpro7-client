import React from 'react';

import Link from 'components/generic/Link';

import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
  Card,
  HighlightToggler,
} from 'components/Table';

import File from 'components/File';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';

import MemberDBSelector from 'components/MemberDBSelector';

import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';

import ProteomeCard from 'components/Proteome/Card';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import cssBinder from 'styles/cssBinder';

const css = cssBinder(
  ebiGlobalStyles,
  pageStyle,
  styles,
  fonts,
  exporterStyle,
  filtersAndTable,
);

import { toPublicAPI } from 'utils/url';

type ExtraCounters = { counters?: TaxonomyCounters };

const EntryAccessionsRenderer =
  (entryDB: MemberDB | 'interpro') =>
  (accession: string, _row: unknown, extra?: ExtraCounters) => (
    <File
      fileType="accession"
      endpoint={'proteome'}
      name={`${entryDB || 'all'}-entry-accessions-for-${accession}.txt`}
      count={extra?.counters?.entries || 0}
      customLocationDescription={{
        main: { key: 'entry' },
        entry: { db: entryDB || 'all' },
        proteome: { isFilter: true, db: 'UniProt', accession },
      }}
    />
  );

const ProteinFastasRenderer =
  (entryDB: MemberDB | 'interpro') =>
  (accession: string, _row: unknown, extra?: ExtraCounters) => (
    <File
      fileType="fasta"
      endpoint={'proteome'}
      name={`protein-sequences${
        entryDB ? `-matching-${entryDB}` : ''
      }-for-${accession}.fasta`}
      count={extra?.counters?.entries || 0}
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
      /* webpackChunkName: "proteome-summary" */ 'components/Proteome/Summary'
    ),
  loading: () => null,
});

const subPagesForProteome = new Map();
for (const subPage of config.pages.proteome.subPages) {
  subPagesForProteome.set(subPage, subPages.get(subPage));
}

type AllProteomesDownloadProps = {
  description: InterProDescription;
  search: InterProLocationSearch;
  count: number;
  fileType: DownloadFileTypes;
  name: string;
};

const AllProteomesDownload = ({
  description,
  search,
  count,
  fileType,
  name,
}: AllProteomesDownloadProps) => (
  <File
    fileType={fileType}
    name={`proteomes.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={{ ...search, extra_fields: 'counters:entry-protein' }}
    endpoint={'proteome'}
  />
);

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

type ProteomeItem = {
  metadata: ProteomeMetadata;
  extra_fields?: {
    counters: MetadataCounters;
  };
};

/* const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType,
}*/

type Props = {
  customLocation?: InterProLocation;
};

interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteomeItem>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({ data, customLocation, isStale, dataBase }: LoadedProps) => {
  if (!data || !customLocation) return null;

  const { payload, loading, ok, url, status } = data;
  const { description, search } = customLocation;
  let _payload = payload;
  const entryDB = description.entry.db as MemberDB | 'interpro';

  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  const databases = dataBase?.payload?.databases;
  if (loading || notFound) {
    _payload = {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }

  const size = _payload?.count || 0;

  return (
    <div className={css('row', 'filters-and-table')}>
      <nav>
        <div className={css('browse-side-panel')}>
          <div className={css('selector-container')}>
            <MemberDBSelector
              contentType="proteome"
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
              data: { db: databases.uniprot },
              location: window.location,
            }}
            processData={schemaProcessDataTable}
          />
        )}
        <Table
          dataTable={_payload?.results}
          contentType="proteome"
          loading={loading}
          ok={ok}
          status={status}
          isStale={isStale}
          actualSize={size}
          query={search}
          notFound={notFound}
          databases={databases}
          nextAPICall={_payload?.next}
          previousAPICall={_payload?.previous}
          currentAPICall={url}
        >
          <Exporter>
            <div className={css('menu-grid')}>
              <AllProteomesDownload
                description={description}
                search={search}
                count={size}
                fileType="json"
                name="json"
              />
              <AllProteomesDownload
                description={description}
                search={search}
                count={size}
                fileType="tsv"
                name="tsv"
              />
              <ExternalExportButton type={'api'} url={toPublicAPI(url)} />
              <ExternalExportButton
                search={search}
                type={'scriptgen'}
                subpath={descriptionToPath(description)}
              />
            </div>
          </Exporter>
          <PageSizeSelector />
          <Card>
            {(data: ProteomeItem) => (
              <ProteomeCard
                data={data}
                search={search.search as string}
                entryDB={entryDB}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search organism</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            renderer={(accession: string, row) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    main: { key: 'proteome' },
                    proteome: {
                      ...customLocation.description.proteome,
                      accession: accession,
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
                  textToHighlight={search.search as string}
                />
              </Link>
            )}
          >
            Accession
          </Column>
          <Column
            dataKey="name"
            renderer={(name: string, { accession }: ProteomeMetadata) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    main: { key: 'proteome' },
                    proteome: {
                      ...customLocation.description.proteome,
                      accession: accession,
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
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            defaultKey="entry-count"
            renderer={(
              accession: string,
              _row: unknown,
              extra?: ExtraCounters,
            ) => {
              const count = extra?.counters?.proteins || '-';
              return (
                <Link
                  className={css('no-decoration')}
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
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            defaultKey="entryAccessions"
            renderer={EntryAccessionsRenderer(entryDB)}
          >
            Entry accessions
          </Column>
          <Column
            dataKey="accession"
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            defaultKey="protein-count"
            renderer={(
              accession: string,
              _row: unknown,
              extra?: ExtraCounters,
            ) => {
              const count = extra?.counters?.proteins || '-';
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
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            renderer={ProteinFastasRenderer(entryDB)}
          >
            Protein sequences
          </Column>
        </Table>
      </section>
    </div>
  );
};

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
