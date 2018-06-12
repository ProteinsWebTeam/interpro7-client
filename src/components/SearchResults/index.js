import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column, Exporter } from 'components/Table';
import SingleMatch from 'components/SearchResults/SingleMatch';
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
      data: { payload, loading, ok, url },
      isStale,
      searchValue,
      query,
    } = this.props;
    const { entries, hitCount } = payload || {};
    if (!loading && hitCount === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          Your search for <strong>{searchValue}</strong> did not match any
          records in our database.
        </div>
      );
    }
    return (
      <Fragment>
        <SchemaOrgData
          data={{
            name: 'Search Results',
            description: 'Text matches found in InterPro database',
          }}
          processData={schemaProcessDataPageSection}
        />
        {payload && <SingleMatch payload={payload} searchValue={searchValue} />}
        <Table
          dataTable={entries}
          contentType="search"
          actualSize={hitCount}
          query={query}
          isStale={isStale}
          loading={loading}
          ok={ok}
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
            renderer={id => (
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro', accession: id },
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
          <Column
            dataKey="fields.description"
            renderer={d => (
              <Fragment>
                <HighlightedText
                  text={d.join('\n')}
                  maxLength={MAX_LENGTH}
                  textToHighlight={searchValue}
                />
              </Fragment>
            )}
            cellStyle={{ textAlign: 'justify' }}
          >
            Description
          </Column>
        </Table>
      </Fragment>
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
    const fields = 'PDB,UNIPROT,description';
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
