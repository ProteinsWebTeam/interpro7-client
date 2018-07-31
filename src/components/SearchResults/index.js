import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import Description from 'components/Description';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Link from 'components/generic/Link';
import Table, { Column, Exporter, PageSizeSelector } from 'components/Table';
import ExactMatch from 'components/SearchResults/ExactMatch';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const INTERPRO_ACCESSION_PADDING = 6;
const MAX_LENGTH = 200;

class SearchResults extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
      ok: T.bool,
      url: T.string,
    }),
    isStale: T.bool.isRequired,
    searchValue: T.string,
    query: T.object,
  };

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      searchValue,
      query,
    } = this.props;
    if (!searchValue) return null;
    const { entries, hitCount } = payload || {};
    if (!loading && hitCount === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          Your search for <strong>{searchValue}</strong> did not match any
          records in our database.
        </div>
      );
    }
    // TODO: Use Improved description component to show summary (with  limit of characters and highlight) as there is a limitation for search starting with "cite..." or "taxon..." in this case
    const reg = /\<[^"].*?id="([^"]+)"\/>/gi; /*all TAGS containing ID e.g. [<cite id="PUB00068465"/>] <dbxref db="INTERPRO" id="IPR009071"/>*/
    const regtax = /\<taxon [^>]+>([^<]+)<\/taxon>/gi; /*Remove TAG taxon and just keep the inside text part e.e <taxon tax_id="217897">...</taxon>*/
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
          <Exporter>
            <Link
              disabled={!url}
              target="_blank"
              href={url}
              download={`SearchResults-${searchValue}.json`}
            >
              JSON
            </Link>
          </Exporter>
          <Column
            dataKey="id"
            renderer={(
              id,
              {
                fields: {
                  source_database: [db],
                },
              },
            ) => (
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db, accession: id },
                  },
                }}
              >
                <HighlightedText text={id} textToHighlight={searchValue} />
              </Link>
            )}
            headerStyle={{ width: '200px' }}
          >
            Accession
          </Column>
          <Column dataKey="fields.source_database.0">Source database</Column>
          <Column
            dataKey="fields.description"
            renderer={d => (
              <div>
                <HighlightedText
                  text={d
                    .join('\n')
                    .replace('<p>', '')
                    .replace('</p>', '')
                    .replace(regtax, '$1')
                    .replace(reg, '$1')
                    .replace('[]', '')
                    .replace('()', '')}
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
  state => state.customLocation.description.search.value,
  state => state.customLocation.search,
  (searchValue, query) => ({ searchValue, query }),
);

const getQueryTerm = createSelector(
  query => query,
  query => {
    const number = +query;
    if (!Number.isInteger(number)) return query;
    const stringified = number.toString();
    if (stringified.length > INTERPRO_ACCESSION_PADDING) return query;
    return `IPR${stringified.padStart(
      INTERPRO_ACCESSION_PADDING,
      '0',
    )} OR ${query}`;
  },
);

const getEbiSearchUrl = createSelector(
  state => state.settings.ebi,
  state => state.settings.navigation.pageSize,
  state => state.customLocation.search,
  state => state.customLocation.description.search.value,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    search,
    searchValue,
  ) => {
    if (!searchValue) return null;
    const fields = 'description,source_database';
    const size = search.page_size || settingsPageSize;
    const start = ((search.page || 1) - 1) * size;
    const query = getQueryTerm(searchValue);
    const params = `?query=${query}&format=json&fields=${fields}&start=${start}&size=${size}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default connect(mapStateToProps)(
  loadData(getEbiSearchUrl)(SearchResults),
);
