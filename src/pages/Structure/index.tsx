import React from 'react';

import Link from 'components/generic/Link';

import MemberDBSelector from 'components/MemberDBSelector';
import LazyImage from 'components/LazyImage';

import StructureListFilters from 'components/Structure/StructureListFilters';

import StructureCard from 'components/Structure/Card';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import File from 'components/File';

import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import pageStyle from '../style.css';

import { formatExperimentType } from 'components/Structure/utils';
import exporterStyle from 'components/Table/Exporter/style.css';
import theme from 'styles/theme-interpro.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import cssBinder from 'styles/cssBinder';

import { toPublicAPI } from 'utils/url';

const css = cssBinder(
  ebiGlobalStyles,
  pageStyle,
  fonts,
  exporterStyle,
  theme,
  filtersAndTable,
);

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "structure-summary" */ 'components/Structure/Summary'
    ),
  loading: () => null,
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*
type OverviewProps = {
  payload: EntryStructurePayload,
  loading: boolean
}

const Overview = (
  {
    payload, loading
  } : OverviewProps
) => {
  if (loading) return <Loading />;
  return (
    <ul className={css('card')}>
      {Object.entries(payload.structures || {}).map(([name, count]) => (
        <li key={name}>
          <Link
            to={{
              description: {
                main: { key: 'structure' },
                structure: { db: name },
              },
            }}
          >
            {name} ({count})
          </Link>
        </li>
      ))}
    </ul>
  );
};*/

type AllProteomesDownloadProps = {
  description: InterProDescription;
  search: InterProLocationSearch;
  count: number;
  fileType: DownloadFileTypes;
  name: string;
};

const AllStructuresDownload = ({
  description,
  search,
  count,
  fileType,
  name,
}: AllProteomesDownloadProps) => (
  <File
    fileType={fileType}
    name={`structures.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={search}
    endpoint={'structure'}
  />
);

type StructureItem = {
  metadata: StructureMetadata;
  extra_fields?: {
    counters: MetadataCounters;
  };
};

type Props = {
  customLocation?: InterProLocation;
};

interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<EntryStructurePayload>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({ data, customLocation, isStale, dataBase }: LoadedProps) => {
  if (!data || !customLocation) return null;

  const { payload, loading, ok, url, status } = data;

  const { description, search } = customLocation;

  const {
    structure: { db },
  } = description;

  const entryDB = description.entry.db as MemberDB | 'interpro';

  let _payload = payload;

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

  const includeGrid = url;

  return (
    <div className={css('row', 'filters-and-table')}>
      <nav>
        <div className={css('browse-side-panel')}>
          <div className={css('selector-container')}>
            <MemberDBSelector
              contentType="structure"
              className="pp-left-side-db-selector"
            />
          </div>
          <hr style={{ paddingTop: '0.5rem' }} />
          <StructureListFilters />
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
        <Table
          dataTable={_payload?.results}
          contentType="structure"
          loading={loading}
          ok={ok}
          status={status}
          isStale={isStale}
          actualSize={size}
          query={search}
          notFound={notFound}
          withGrid={!!includeGrid}
          databases={databases}
          nextAPICall={_payload?.next}
          previousAPICall={_payload?.previous}
          currentAPICall={url}
        >
          <Exporter>
            <div className={css('menu-grid')}>
              <AllStructuresDownload
                name="json"
                description={description}
                search={search}
                count={size}
                fileType="json"
              />
              <AllStructuresDownload
                name="tsv"
                description={description}
                search={search}
                count={size}
                fileType="tsv"
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
            {(data: StructureItem) => (
              <StructureCard
                data={data}
                search={search.search as string}
                entryDB={entryDB}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search structures</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            renderer={(accession: string, row: unknown) => (
              <Link
                to={(customLocation) => ({
                  ...customLocation,
                  description: {
                    main: { key: 'structure' },
                    structure: {
                      db: customLocation.description.structure.db,
                      accession,
                    },
                  },
                  search: {},
                })}
              >
                <SchemaOrgData
                  data={{
                    data: { row, endpoint: 'structure' },
                    location: window.location,
                  }}
                  processData={schemaProcessDataTableRow}
                />
                <HighlightedText
                  text={accession || ''}
                  textToHighlight={search.search as string}
                />
              </Link>
            )}
          >
            Accession
          </Column>
          <Column
            dataKey="name"
            renderer={(name: string, { accession }: StructureMetadata) => (
              <Link
                to={(customLocation) => ({
                  ...customLocation,
                  description: {
                    main: { key: 'structure' },
                    structure: {
                      db: customLocation.description.structure.db,
                      accession: accession,
                    },
                  },
                  search: {},
                })}
              >
                <HighlightedText
                  text={name.toUpperCase()}
                  textToHighlight={search.search as string}
                />
              </Link>
            )}
          >
            Name
          </Column>
          <Column
            dataKey="experiment_type"
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            renderer={(type: string) => formatExperimentType(type)}
          >
            Experiment type
          </Column>
          <Column
            dataKey="resolution"
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            renderer={
              (resolution /*: string | number */) =>
                resolution
                  ? resolution + (typeof resolution === 'number' ? ' Å' : '')
                  : '' /* replace symbol by nothing to be consistent (with go terms column in browse entry for e.g.) */
            }
          >
            Resolution
          </Column>
          <Column
            dataKey="accession"
            headerClassName={css('table-center')}
            cellClassName={css('table-center')}
            defaultKey="structureAccession"
            renderer={(accession /*: string */) => (
              <Link
                to={(customLocation) => ({
                  ...customLocation,
                  description: {
                    main: { key: 'structure' },
                    structure: {
                      db: customLocation.description.structure.db,
                      accession,
                    },
                  },
                  search: {},
                })}
              >
                <LazyImage
                  src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${accession}&file=traces.jpg`}
                  alt={`structure with accession ${accession}`}
                  style={{ maxWidth: '33%' }}
                />
              </Link>
            )}
          >
            Structure
          </Column>
        </Table>
      </section>
    </div>
  );
};

const subPagesForStructure = new Map();
for (const subPage of config.pages.structure.subPages) {
  subPagesForStructure.set(subPage, subPages.get(subPage));
}

const childRoutesReg = /^[a-z\d]{4}$/i;

const Structure = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForStructure}
  />
);

export default Structure;
