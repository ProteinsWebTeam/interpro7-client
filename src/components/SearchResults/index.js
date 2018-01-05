// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column, Exporter } from 'components/Table';
import SingleMatch from 'components/SearchResults/SingleMatch';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const INTERPRO_ACCESSION_PADDING = 6;
const MAX_LENGTH = 200;

class SearchResults extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
      loading: T.bool.isRequired,
    }),
    searchValue: T.string,
    dataUrl: T.string,
  };

  render() {
    const { data: { payload, loading }, searchValue, dataUrl } = this.props;
    if (loading) return <Loading />;
    if (!payload) return null;
    if (payload.hitCount === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          Your search for <strong>{searchValue}</strong> did not match any
          records in our database.
        </div>
      );
    }
    return (
      <React.Fragment>
        <SingleMatch payload={payload} searchValue={searchValue} />
        <Table
          dataTable={payload.entries}
          actualSize={payload.hitCount}
          query={{ search: { search: searchValue } }}
          pathname="/search/text"
        >
          <Exporter>
            <a href={dataUrl} download={`SearchResults-${searchValue}.json`}>
              JSON
            </a>
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
                {id}
              </Link>
            )}
            headerStyle={{ width: '200px' }}
          >
            Accession
          </Column>
          <Column
            dataKey="fields"
            renderer={d => (
              <React.Fragment>
                <HighlightedText
                  text={d.description[0].slice(0, MAX_LENGTH)}
                  textToHighlight={searchValue}
                />…
              </React.Fragment>
            )}
            cellStyle={{ textAlign: 'justify' }}
          >
            Description
          </Column>
        </Table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.data.dataUrl,
  state => state.customLocation.description.search.value,
  (dataUrl, searchValue) => ({ dataUrl, searchValue }),
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
    const s = search || {};
    if (!searchValue) return null;
    const fields = 'PDB,UNIPROT,description';
    s.page_size = s.page_size || settingsPageSize;
    s.search = searchValue;
    const query = getQueryTerm(s.search);
    const params = `?query=${query}&format=json&fields=${fields}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default connect(mapStateToProps)(
  loadData(getEbiSearchUrl)(SearchResults),
);
