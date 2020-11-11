// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import { createSelector } from 'reselect';
// import Description from 'components/Description';
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

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { ebiSearch2urlDB } from 'utils/url-patterns';
import FileExporter from './FileExporter';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const f = foundationPartial(ebiGlobalStyles, ipro, local, fonts, exporterStyle);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const MAX_LENGTH = 200;

const regTag = /&lt;\/?(p|ul|li)&gt;/gi;
const regtax = /\<taxon [^>]+>([^<]+)<\/taxon>/gi; /* Remove TAG taxon and just keep the inside text part e.e <taxon tax_id="217897">...</taxon> */
const reg = /\<[^"].*?id="([^"]+)"\/>/gi; /* all TAGS containing ID e.g. [<cite id="PUB00068465"/>] <dbxref db="INTERPRO" id="IPR009071"/> */

export const decodeDescription = (description) =>
  description
    .join('\n')
    .replace(regTag, '')
    .replace(regtax, '$1')
    .replace(reg, '$1')
    .replace('[]', '')
    .replace('()', '');

/*:: type Props = {
  data: {
    payload: Object,
    loading: boolean,
    ok?: boolean,
    url?: string,
    status?: number
  },
  isStale: boolean,
  searchValue: string,
  query: Object,
}; */

export class SearchResults extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: dataPropType,
    isStale: T.bool.isRequired,
    searchValue: T.string,
    query: T.object,
  };

  render() {
    const {
      data: { payload, loading, ok, status },
      isStale,
      searchValue,
      query,
    } = this.props;
    if (!searchValue) return null;
    const { entries, hitCount } = payload || {};
    if (!loading && hitCount === 0) {
      return (
        <>
          <ExactMatch searchValue={searchValue} />
          <div className={f('callout', 'info', 'withicon')}>
            Your search for <strong>{searchValue}</strong> did not match any
            InterPro entries.
          </div>
        </>
      );
    }
    // TODO: Use Improved description component to show summary (with  limit of characters and highlight) as there is a limitation for search starting with "cite..." or "taxon..." in this case
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
            <div className={f('menu-grid')}>
              <label htmlFor="json">JSON</label>
              <FileExporter
                fileType="json"
                name={`SearchResults-${searchValue}.json`}
                count={hitCount}
              />
              <label htmlFor="tsv">TSV</label>
              <FileExporter
                fileType="tsv"
                name={`SearchResults-${searchValue}.tsv`}
                count={hitCount}
              />
            </div>
          </Exporter>
          <Column
            dataKey="id"
            renderer={(
              accession,
              {
                fields: {
                  source_database: [db],
                },
              },
            ) => (
              <Link
                className={f('acc-row')}
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: db && ebiSearch2urlDB(db), accession },
                  },
                }}
              >
                <HighlightedText
                  text={accession}
                  textToHighlight={searchValue}
                />
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
              accession,
              {
                fields: {
                  name: [name],
                  source_database: [db],
                },
              },
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
            renderer={(d) => (
              <div>
                <HighlightedText
                  text={decodeDescription(d)}
                  maxLength={MAX_LENGTH}
                  textToHighlight={searchValue}
                />

                {
                  //   <Description
                  // textBlocks={d}
                  //  withoutIDs
                  //  />
                }
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
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.search.value,
  (state) => state.customLocation.search,
  (searchValue, query) => ({ searchValue, query }),
);

export const getQueryTerm = createSelector(
  (query) => query,
  (query) =>
    `${query.replace(
      /([+\-&|!\(\)\{\}\[\]\^\"\~\*\?:\/])/g,
      '\\$1',
    )} AND (source_database:interpro%5E2 OR *:*)`, // %5E2 => ^2 =>  is to give more priority to that part of the query
);

const getEbiSearchUrl = createSelector(
  (state) => state.settings.ebi,
  (state) => state.settings.navigation.pageSize,
  (state) => state.customLocation.search,
  (state) => state.customLocation.description.search.value,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    search,
    searchValue,
  ) => {
    if (!searchValue) return null;
    const fields = 'description,name,source_database';
    const size = search.page_size || settingsPageSize;
    const start = ((search.page || 1) - 1) * size;
    const query = encodeURIComponent(getQueryTerm(searchValue));
    const params = `?query=${query}&format=json&fields=${fields}&start=${start}&size=${size}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default loadData({ getUrl: getEbiSearchUrl, mapStateToProps })(
  SearchResults,
);
