/* eslint max-statements: ["error", 13] */
import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import Link from 'components/generic/Link';

import {frame} from 'timing-functions/src';

import Table, {Column, /* PageSizeSelector, */Exporter} from 'components/Table';

const maxLength = 200;
const NOT_FOUND = -1;
const IPRO_FOUND = 1;
const UNIPROT_FOUND = 2;
const PDB_FOUND = 3;

class SearchResults extends Component {
  constructor(props){
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
    const {query, router} = this.props;
    await frame();
    let goTo = null;
    switch (this.foundType) {
      case IPRO_FOUND:
        goTo = `/entry/interpro/${query.search}`;
        break;
      case UNIPROT_FOUND:
        goTo = `/protein/uniprot/${query.search}`;
        break;
      case PDB_FOUND:
        goTo = `/structure/pdb/${query.search}`;
        break;
      default:
        goTo = null;
    }
    if (goTo && goTo !== this.redirectedTo) {
      this.redirectedTo = goTo;
      router.replace({pathname: goTo});
    }
  }
  render() {
    const {data, search, dataUrl} = this.props;
    this.foundType = NOT_FOUND;
    if (!data) {
      return <div/>;
    } else if (data.hitCount === 0) {
      return <div>There are not matches for the term queried</div>;
    } else if (data.hitCount === 1 && data.entries[0].id === search.search){
      this.foundType = IPRO_FOUND;
      return <div>Interpro entry found - {search.search}</div>;
    } else if (data.hitCount > 0 &&
      data.entries[0].fields.PDB.indexOf(search.search) !== NOT_FOUND){
      this.foundType = PDB_FOUND;
      return <div>PDB structure found - {search.search}</div>;
    } else if (data.hitCount > 0 &&
      data.entries[0].fields.UNIPROT.indexOf(search.search) !== NOT_FOUND) {
      this.foundType = UNIPROT_FOUND;
      return <div>UniProt protein found - {search.search}</div>;
    }
    return (
      <Table
        data={{results: data.entries, count: data.hitCount}}
        query={search}
        pathname="/search"
        title="Search Results"
      >
        <Exporter>
          <a href={dataUrl} download="SearchResults.json">JSON</a>
        </Exporter>
        {/*<PageSizeSelector pageSize={query.page_size}/>*/}
        <Column
          accessKey="id"
          renderer={id => (
            <Link to={`/entry/interpro/${id}`}>
              {id}
            </Link>
          )
          }
          headerStyle={{width: '200px'}}
        >
          Accession
        </Column>

        <Column
          accessKey="fields"
          renderer={d => (
            <div>{d.description[0].slice(0, maxLength)}...</div>
          )}
          cellStyle={{textAlign: 'justify'}}
        >
          Description
        </Column>

      </Table>
    );

  }
}
SearchResults.propTypes = {
  data: T.object,
  search: T.object,
  dataUrl: T.string,
};

export default connect(
  ({data: {dataUrl}, location: {search}}) => ({dataUrl, search})
)(SearchResults);
