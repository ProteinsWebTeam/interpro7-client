import React from 'react';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Link from 'components/generic/Link';
import Table, {
  Column,
  Exporter,
  PageSizeSelector,
  HighlightToggler,
} from 'components/Table';
import ExactMatch from 'components/SearchResults/ExactMatch';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Callout from 'components/SimpleCommonComponents/Callout';

import loadData from 'higherOrder/loadData/ts';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { ebiSearch2urlDB } from 'utils/url-patterns';

import FileExporter from './FileExporter';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const css = cssBinder(local, fonts, exporterStyle);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const MAX_LENGTH = 200;

const regTag = /&lt;\/?(p|ul|li)&gt;/gi;
const regtax =
  /<taxon [^>]+>([^<]+)<\/taxon>/gi; /* Remove TAG taxon and just keep the inside text part e.e <taxon tax_id="217897">...</taxon> */
const reg =
  /<[^"].*?id="([^"]+)"\/>/gi; /* all TAGS containing ID e.g. [<cite id="PUB00068465"/>] <dbxref db="INTERPRO" id="IPR009071"/> */

export const decodeDescription = (description: Array<string>) =>
  description
    .join('\n')
    .replace(regTag, '')
    .replace(regtax, '$1')
    .replace(reg, '$1')
    .replace('[]', '')
    .replace('()', '');

type Props = {
  searchValue: string;
  query: InterProLocationSearch;
};
interface LoadedProps extends Props, LoadDataProps<EBISearchPayload> {}

export const SearchResults = ({
  data,
  isStale,
  searchValue,
  query,
}: LoadedProps) => {
  if (!data) return null;
  const { payload, loading, ok, status } = data;
  if (!searchValue) return null;
  const { entries, hitCount } = payload || {};
  if (!loading && hitCount === 0) {
    return (
      <>
        <ExactMatch searchValue={searchValue} />
        <Callout type="info">
          No results found for <strong>{searchValue}</strong>.
        </Callout>
      </>
    );
  }
  return (
    <ErrorBoundary>
      <SchemaOrgData
        data={{
          name: 'Search Results',
          description: 'Text matches found in InterPro database',
        }}
        processData={schemaProcessDataPageSection}
      />
      <ExactMatch searchValue={searchValue} />
      <Table
        dataTable={entries}
        contentType="entry"
        actualSize={hitCount}
        query={query}
        isStale={isStale}
        loading={loading}
        ok={ok}
        status={status}
      >
        <HighlightToggler />
        <Exporter>
          <div className={css('menu-grid')}>
            <FileExporter
              fileType="json"
              name={`SearchResults${searchValue}.json`}
              count={hitCount}
            />
            <FileExporter
              fileType="tsv"
              name={`SearchResults${searchValue}.tsv`}
              count={hitCount}
            />
          </div>
        </Exporter>
        <Column
          dataKey="id"
          renderer={(
            accession: string,
            {
              fields: {
                source_database: [db],
              },
            }: EBISearchEntry,
          ) => (
            <Link
              className={css('acc-row')}
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: db && ebiSearch2urlDB(db), accession },
                },
              }}
            >
              <HighlightedText text={accession} textToHighlight={searchValue} />
            </Link>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="id"
          defaultKey="name"
          headerStyle={{ width: '28%' }}
          renderer={(
            accession: string,
            {
              fields: {
                name: [name],
                source_database: [db],
              },
            }: EBISearchEntry,
          ) => (
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: db && ebiSearch2urlDB(db), accession },
                },
              }}
            >
              <HighlightedText text={name} textToHighlight={searchValue} />
            </Link>
          )}
        >
          Name
        </Column>
        <Column dataKey="fields.source_database">Source database</Column>
        <Column
          dataKey="fields.description"
          renderer={(description: Array<string>) => (
            <div>
              <HighlightedText
                text={decodeDescription(description)}
                maxLength={MAX_LENGTH}
                textToHighlight={searchValue}
              />
            </div>
          )}
          cellStyle={{ textAlign: 'justify' }}
        >
          Description
        </Column>
        <PageSizeSelector />
      </Table>
    </ErrorBoundary>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.search.value,
  (state: GlobalState) => state.customLocation.search,
  (searchValue, query) => ({ searchValue, query }),
);

export const getQueryTerm = createSelector(
  (query) => query,
  (query) =>
    `${query.replace(
      /([+\-&|!(){}[\]^"~*?:/])/g,
      '\\$1',
    )} AND (source_database:interpro%5E2 OR *:*)`, // %5E2 => ^2 =>  is to give more priority to that part of the query
);

const getEbiSearchUrl = createSelector(
  (state: GlobalState) => state.settings.ebi,
  (state: GlobalState) => state.settings.navigation.pageSize,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.customLocation.description.search.value,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    search,
    searchValue,
  ) => {
    if (!searchValue) return null;
    const fields = 'description,name,source_database';
    const size = Number(search.page_size) || settingsPageSize;
    const start = (Number(search.page || 1) - 1) * size;
    const query = encodeURIComponent(getQueryTerm(searchValue));
    const params = `?query=${query}&format=json&fields=${fields}&start=${start}&size=${size}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData({
  getUrl: getEbiSearchUrl,
  mapStateToProps,
} as LoadDataParameters)(SearchResults);
