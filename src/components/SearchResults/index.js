import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import Table, { Column, Exporter } from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const MAX_LENGTH = 200;
const NOT_FOUND = -1;

class SearchResults extends PureComponent {
  static propTypes = {
    data: T.object,
    searchValue: T.string,
    dataUrl: T.string,
  };

  render() {
    const { data: { payload, loading }, searchValue, dataUrl } = this.props;
    if (loading) return <Loading />;
    if (!payload) {
      return <div />;
    } else if (payload.hitCount === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          Your search for <strong>{searchValue}</strong> did not match any
          records in our database.
        </div>
      );
    } else if (
      payload.hitCount === 1 &&
      payload.entries[0].id === searchValue
    ) {
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db: 'InterPro', accession: searchValue },
            },
          }}
        />
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.PDB.indexOf(searchValue) !== NOT_FOUND
    ) {
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'structure' },
              entry: { db: 'PDB', accession: searchValue },
            },
          }}
        />
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.UNIPROT.indexOf(searchValue) !== NOT_FOUND
    ) {
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'protein' },
              protein: { db: 'UniProt', accession: searchValue },
            },
          }}
        />
      );
    }
    return (
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
            <div>
              <HighlightedText
                text={d.description[0].slice(0, MAX_LENGTH)}
                textToHighlight={searchValue}
              />…
            </div>
          )}
          cellStyle={{ textAlign: 'justify' }}
        >
          Description
        </Column>
      </Table>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.data.dataUrl,
  state => state.customLocation.description.search.value,
  (dataUrl, searchValue) => ({ dataUrl, searchValue }),
);

const getEbiSearchUrl = createSelector(
  state => state.settings.ebi,
  state => state.settings.pagination,
  state => state.customLocation.search,
  state => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, pagination, search, searchValue) => {
    const s = search || {};
    if (!searchValue) return null;
    const fields = 'PDB,UNIPROT,description';
    s.page_size = s.page_size || pagination.pageSize;
    s.search = searchValue;
    const params = `?query=${s.search}&format=json&fields=${fields}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default connect(mapStateToProps)(
  loadData(getEbiSearchUrl)(SearchResults),
);
