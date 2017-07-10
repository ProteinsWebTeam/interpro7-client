/* eslint max-statements: ["error", 13] */
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { frame } from 'timing-functions/src';

import Link from 'components/generic/Link';
import { goToNewLocation } from 'actions/creators';
import loadData from 'higherOrder/loadData';
import Table, {
  Column,
  /* PageSizeSelector, */ Exporter,
} from 'components/Table';

const maxLength = 200;
const NOT_FOUND = -1;
const IPRO_FOUND = 1;
const UNIPROT_FOUND = 2;
const PDB_FOUND = 3;

class SearchResults extends Component {
  static propTypes = {
    data: T.object,
    search: T.object,
    dataUrl: T.string,
    goToNewLocation: T.func,
  };

  constructor(props) {
    super(props);
    this.foundType = 0;
    this.redirectedTo = null;
  }

  componentDidMount() {
    this.redirect();
  }

  componentDidUpdate() {
    this.redirect();
  }

  async redirect() {
    const { search } = this.props;
    await frame();
    let goTo = null;
    switch (this.foundType) {
      case IPRO_FOUND:
        goTo = `/entry/interpro/${search.search}`;
        break;
      case UNIPROT_FOUND:
        goTo = `/protein/uniprot/${search.search}`;
        break;
      case PDB_FOUND:
        goTo = `/structure/pdb/${search.search}`;
        break;
      default:
        goTo = null;
    }
    if (goTo && goTo !== this.redirectedTo) {
      console.log(goTo);
      this.redirectedTo = goTo;
      this.props.goToNewLocation({ pathname: goTo });
    }
  }

  render() {
    const { data: { payload, loading }, search, dataUrl } = this.props;
    this.foundType = NOT_FOUND;
    if (loading) return <div>Loading…</div>;
    if (!payload) {
      return <div />;
    } else if (payload.hitCount === 0) {
      return <div>There are not matches for the term queried</div>;
    } else if (
      payload.hitCount === 1 &&
      payload.entries[0].id === search.search
    ) {
      this.foundType = IPRO_FOUND;
      return (
        <div>
          Interpro entry found - {search.search}
        </div>
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.PDB.indexOf(search.search) !== NOT_FOUND
    ) {
      this.foundType = PDB_FOUND;
      return (
        <div>
          PDB structure found - {search.search}
        </div>
      );
    } else if (
      payload.hitCount > 0 &&
      payload.entries[0].fields.UNIPROT.indexOf(search.search) !== NOT_FOUND
    ) {
      this.foundType = UNIPROT_FOUND;
      return (
        <div>
          UniProt protein found - {search.search}
        </div>
      );
    }
    return (
      <Table
        dataTable={payload.entries}
        actualSize={payload.hitCount}
        query={search}
        pathname="/search/text"
        title="Search Results"
      >
        <Exporter>
          <a href={dataUrl} download="SearchResults.json">
            JSON
          </a>
        </Exporter>
        {/* <PageSizeSelector pageSize={query.page_size}/>*/}
        <Column
          accessKey="id"
          renderer={id =>
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
            </Link>}
          headerStyle={{ width: '200px' }}
        >
          Accession
        </Column>
        <Column
          accessKey="fields"
          renderer={d =>
            <div>
              {d.description[0].slice(0, maxLength)}…
            </div>}
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

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getEbiSearchUrl)(SearchResults),
);
