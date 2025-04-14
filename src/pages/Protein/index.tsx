import React, { useRef } from 'react';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import SpaceFiller from 'components/SimpleCommonComponents/SpaceFiller';
import Link from 'components/generic/Link';

import MemberDBSelector from 'components/MemberDBSelector';

import ProteinCard from 'components/Protein/Card';

import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';

import ProteinListFilters from 'components/Protein/ProteinListFilters';
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

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import cssBinder from 'styles/cssBinder';

import { toPublicAPI } from 'utils/url';

const css = cssBinder(
  fonts,
  pageStyle,
  ebiStyles,
  ipro,
  exporterStyle,
  filtersAndTable,
);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

/*const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType.isRequired,
};*/

type AllProteinDownloadProps = {
  description: InterProDescription;
  search: InterProLocationSearch;
  count: number;
  fileType: DownloadFileTypes;
  name: string;
};

const AllProteinDownload = ({
  description,
  search,
  count,
  fileType,
  name,
}: AllProteinDownloadProps) => (
  <File
    fileType={fileType}
    name={`protein-sequences.${fileType}`}
    count={count}
    customLocationDescription={description}
    endpoint="protein"
    search={search}
  />
);

type ProteinItem = {
  metadata: ProteinMetadata;
  extra_fields?: {
    counters: MetadataCounters;
  };
};

type Props = {
  customLocation?: InterProLocation;
};

interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteinItem>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({ data, customLocation, isStale, dataBase }: LoadedProps) => {
  const filterPanel = useRef(null);

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
        <div className={css('browse-side-panel')} ref={filterPanel}>
          <div className={css('selector-container')}>
            <MemberDBSelector
              contentType="protein"
              className="pp-left-side-db-selector"
            />
          </div>
          <hr style={{ paddingTop: '0.5rem' }} />
          {!search.ida && <ProteinListFilters />}
        </div>
        <SpaceFiller
          element={filterPanel?.current}
          refresh={entryDB === null}
        />
      </nav>
      <section>
        {databases && entryDB && databases[entryDB.toLowerCase()] && (
          <SchemaOrgData
            data={{
              data: { db: databases[entryDB.toLowerCase()] },
              location: window.location,
            }}
            processData={schemaProcessDataTable}
          />
        )}
        <Table
          dataTable={_payload?.results}
          contentType="protein"
          isStale={isStale}
          loading={loading}
          ok={ok}
          status={status}
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
              <AllProteinDownload
                description={description}
                search={search}
                count={size}
                fileType="fasta"
                name="fasta"
              />
              <AllProteinDownload
                name="json"
                description={description}
                search={search}
                count={size}
                fileType="json"
              />
              <AllProteinDownload
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
          <Card>
            {(data: ProteinItem) => (
              <ProteinCard
                data={data}
                search={search.search as string}
                entryDB={entryDB}
              />
            )}
          </Card>
          <PageSizeSelector />
          <SearchBox loading={isStale}>Search proteins</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            cellClassName={'nowrap'}
            renderer={(accession: string, row) => (
              <>
                <SchemaOrgData
                  data={{
                    data: { row, endpoint: 'protein' },
                    location: window.location,
                  }}
                  processData={schemaProcessDataTableRow}
                />
                <Link
                  to={(customLocation) => ({
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
                  className={css('acc-row')}
                >
                  <HighlightedText
                    text={accession || ''}
                    textToHighlight={search.search as string}
                  />
                </Link>
                {row.source_database === 'reviewed' ? (
                  <>
                    {'\u00A0' /* non-breakable space */}
                    <Tooltip title="Reviewed by UniProtKB curators">
                      <span
                        className={css('icon', 'icon-common')}
                        data-icon="&#xf2f0;"
                        aria-label="reviewed"
                      />
                    </Tooltip>
                  </>
                ) : null}
              </>
            )}
          />
          <Column
            dataKey="name"
            renderer={(name: string, { accession }: ProteinMetadata) => (
              <Link
                to={(customLocation) => ({
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
                  textToHighlight={search.search as string}
                />
              </Link>
            )}
          >
            Name
          </Column>
          <Column
            dataKey="source_organism"
            renderer={({ fullName, taxId }: SourceOrganism) => (
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
            dataKey="gene"
            renderer={(gene: string) => <span aria-label="gene">{gene}</span>}
          >
            Gene
          </Column>
          <Column
            dataKey="length"
            headerClassName={css('text-right')}
            cellClassName={css('text-right')}
            renderer={(length: number) => (
              <Tooltip title={`${length.toLocaleString()} amino acids`}>
                <span aria-label="amino acids length">
                  {length.toLocaleString()}
                </span>
              </Tooltip>
            )}
          >
            Length
          </Column>
          <Column
            dataKey="in_alphafold"
            renderer={(inAlphafold, { accession, in_bfvd }: ProteinMetadata) =>
              inAlphafold ? (
                <Link
                  to={{
                    description: {
                      main: { key: 'protein' },
                      protein: {
                        db: 'uniprot',
                        accession,
                        detail: 'alphafold',
                      },
                    },
                  }}
                >
                  AlphaFold
                </Link>
              ) : in_bfvd ? (
                <Link
                  to={{
                    description: {
                      main: { key: 'protein' },
                      protein: {
                        db: 'uniprot',
                        accession,
                        detail: 'bfvd',
                      },
                    },
                  }}
                >
                  BFVD
                </Link>
              ) : null
            }
          >
            Predicted structure
          </Column>{' '}
        </Table>
      </section>
    </div>
  );
};

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "protein-summary" */ 'components/Protein/Summary'
    ),
  loading: () => null,
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForProtein = new Map();
for (const subPage of config.pages.protein.subPages) {
  subPagesForProtein.set(subPage, subPages.get(subPage));
}

const childRoutesReg =
  /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;

const Protein = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForProtein}
  />
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.settings.ui.lowGraphics,
  (customLocation, api, lowGraphics) => ({ customLocation, api, lowGraphics }),
);

export default loadData({
  getUrl: getUrlForApi,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(Protein);
