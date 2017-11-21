import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import Table, { Column, Exporter } from 'components/Table';
import { HighlightedText } from 'components/SimpleCommonComponents';
import { Loading } from 'components/SimpleCommonComponents';

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
    search: T.object,
    dataUrl: T.string,
  };

  render() {
    const { data: { payload, loading }, search, dataUrl } = this.props;
    if (loading) return <Loading />;
    if (!payload) {
      return <div />;
    } else if (payload.hitCount === 0) {
      return (
        <div className={f('callout', 'info', 'withicon')}>
          There is no match for the term queried.
        </div>
      );
    } else if (
      payload.hitCount === 1 &&
      payload.entries[0].id === search.search
    ) {
      return (
        <Redirect
          to={{
            description: {
              mainType: 'entry',
              mainDB: 'InterPro',
              mainAccession: search.search,
            },
          }}
        />
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.PDB.indexOf(search.search) !== NOT_FOUND
    ) {
      return (
        <Redirect
          to={{
            description: {
              mainType: 'structure',
              mainDB: 'PDB',
              mainAccession: search.search,
            },
          }}
        />
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.UNIPROT.indexOf(search.search) !== NOT_FOUND
    ) {
      return (
        <Redirect
          to={{
            description: {
              mainType: 'protein',
              mainDB: 'UniProt',
              mainAccession: search.search,
            },
          }}
        />
      );
    }
    return (
      <Table
        dataTable={payload.entries}
        actualSize={payload.hitCount}
        query={search}
        pathname="/search/text"
      >
        <Exporter>
          <a href={dataUrl} download={`SearchResults-${search.search}.json`}>
            JSON
          </a>
        </Exporter>
        <Column
          dataKey="id"
          renderer={id => (
            <Link
              newTo={{
                description: {
                  mainType: 'entry',
                  mainDB: 'InterPro',
                  mainAccession: id,
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
                textToHighlight={search.search}
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
  state => state.newLocation.search,
  (dataUrl, search) => ({ dataUrl, search }),
);

const getEbiSearchUrl = createSelector(
  state => state.settings.ebi,
  state => state.settings.pagination,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, pagination, search) => {
    const s = search || {};
    if (!s.search) return null;
    const fields = 'PDB,UNIPROT,description';
    s.page_size = s.page_size || pagination.pageSize;
    const params = `?query=${s.search}&format=json&fields=${fields}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);

export default connect(mapStateToProps)(
  loadData(getEbiSearchUrl)(SearchResults),
);
