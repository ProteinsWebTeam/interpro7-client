import React, { useState } from 'react';

import { includeTaxonFocusedOnURL } from 'higherOrder/loadData/defaults';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import TaxonomyCard from 'components/Taxonomy/Card';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';
import File from 'components/File';
import APIViewButton from 'components/Table/Exporter/APIViewButton';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import pageStyle from 'pages/style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import local from './style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';
import AllTaxDownload from './AllTaxDownload';

const css = cssBinder(
  pageStyle,
  styles,
  fonts,
  exporterStyle,
  local,
  filtersAndTable,
);

type ExtraCounters = { counters?: TaxonomyCounters };

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const EntryAccessionsRenderer =
  (entryDB: MemberDB | 'interpro') =>
  (taxId: string, _row: unknown, extra?: ExtraCounters) => (
    <File
      fileType="accession"
      name={`${entryDB || 'all'}-entry-accessions-for-${taxId}.txt`}
      count={extra?.counters?.entries || 0}
      customLocationDescription={{
        main: { key: 'entry' },
        entry: { db: entryDB || 'all' },
        taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
      }}
    />
  );

const ProteinFastasRenderer =
  (entryDB: MemberDB | 'interpro') =>
  (taxId: string, _row: unknown, extra?: ExtraCounters) => (
    <File
      fileType="fasta"
      name={`protein-sequences${
        entryDB ? `-matching-${entryDB}` : ''
      }-for-${taxId}.fasta`}
      count={extra?.counters?.proteins || 0}
      customLocationDescription={{
        main: { key: 'protein' },
        protein: { db: 'UniProt' },
        entry: { isFilter: true, db: entryDB || 'all' },
        taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
      }}
    />
  );

type Props = {
  customLocation?: InterProLocation;
  exactMatch?: TaxonommyTreePayload;
};

type TaxItem = {
  metadata: TaxonomyMetadata;
  extra_fields?: {
    counters: TaxonomyCounters;
    lineage?: string;
  };
  className?: string;
};
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<TaxItem>>,
    LoadDataProps<RootAPIPayload, 'Base'> {}

const List = ({
  data,
  isStale,
  customLocation,
  dataBase,
  exactMatch,
}: LoadedProps) => {
  const [focused, setFocused] = useState<string | null>(null);
  if (!data || !customLocation) return null;
  const { payload, loading, ok, url, status } = data;
  const { description, search } = customLocation;
  let _payload = payload;
  let _status = status;
  const entryDB = description.entry.db as MemberDB | 'interpro';

  const HTTP_OK = 200;
  let notFound = !loading && status !== HTTP_OK;
  const databases = dataBase?.payload?.databases;
  if (loading || notFound) {
    _payload = {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }
  const results = [...(_payload?.results || [])];
  let size = _payload?.count || 0;
  if (exactMatch) {
    const indexInPayload = results.findIndex(
      ({ metadata: { accession } }) =>
        accession === exactMatch.metadata.accession,
    );
    if (indexInPayload >= 0) {
      results.splice(indexInPayload, 1);
      size--;
    }

    results.splice(0, 1, {
      ...exactMatch,
      extra_fields: {
        counters: exactMatch.metadata.counters,
      },
      metadata: {
        ...exactMatch.metadata,
        name:
          (exactMatch.metadata.name as NameObject).short ||
          (exactMatch.metadata.name as NameObject).name ||
          (exactMatch.metadata.name as string),
        exact_match: true,
      },
      className: css(local.exactMatch),
    });
    size++;
    notFound = false;
    _status = HTTP_OK;
  }
  const urlToExport = includeTaxonFocusedOnURL(url);

  return (
    <div className={css('row', 'filters-and-table')}>
      <nav>
        <div className={css('browse-side-panel')}>
          <div className={css('selector-container')}>
            <MemberDBSelector
              contentType="taxonomy"
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
          dataTable={results}
          contentType="taxonomy"
          loading={loading}
          ok={ok}
          status={_status}
          isStale={isStale}
          actualSize={size}
          query={search}
          notFound={notFound}
          withTree={true}
          withGrid={true}
          databases={databases}
          nextAPICall={_payload?.next}
          previousAPICall={_payload?.previous}
          currentAPICall={url}
          onFocusChanged={setFocused}
        >
          <Exporter>
            <div className={css('menu-grid')}>
              <label htmlFor="json">JSON</label>
              <AllTaxDownload
                description={description}
                search={search}
                count={size}
                focused={focused}
                fileType="json"
              />

              <label htmlFor="tsv">TSV</label>
              <AllTaxDownload
                description={description}
                search={search}
                count={size}
                focused={focused}
                fileType="tsv"
              />

              <label htmlFor="api">API</label>
              <APIViewButton url={urlToExport} />
            </div>
          </Exporter>
          <PageSizeSelector />
          <Card>
            {(data: TaxItem) => (
              <TaxonomyCard
                data={data}
                search={search.search as string}
                entryDB={entryDB}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search taxonomy</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            renderer={(accession: string, row) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: {
                      ...customLocation.description.taxonomy,
                      accession,
                    },
                  },
                })}
              >
                <SchemaOrgData
                  data={{
                    data: { row, endpoint: 'taxonomy' },
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
            Taxon ID
          </Column>
          <Column
            dataKey="name"
            renderer={(name: string, { accession }: TaxonomyMetadata) => (
              <Link
                to={(customLocation) => ({
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: {
                      ...customLocation.description.taxonomy,
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
              const count = extra?.counters?.entries || '-';
              return (
                <Link
                  className={css('no-decoration')}
                  to={{
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
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
            renderer={(accession: string, _row, extra?: ExtraCounters) => {
              const count = extra?.counters?.proteins || '-';
              return (
                <Link
                  to={{
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
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
            FASTA
          </Column>
        </Table>
      </section>
    </div>
  );
};

export default List;
