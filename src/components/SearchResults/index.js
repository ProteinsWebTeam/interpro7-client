/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }]*/
import React, {PropTypes as T} from 'react';
import {withRouter, Link} from 'react-router/es';
import {connect} from 'react-redux';
import Table, {Column, PageSizeSelector, Exporter} from 'components/Table';
const maxLength = 200;

const SearchResults = ({data, query, router, dataUrl}) => {
  if (!data) {
    return <div/>;
  } else if (data.hitCount === 0) {
    return <div>There are not matches for the term queried</div>;
  } else if (data.hitCount === 1 && data.entries[0].id === query.query){
    window.requestAnimationFrame(() => {
      router.replace(`/entry/interpro/${query.query}`);
    });
    return <div>Interpro entry found - {query.query}</div>;
  } else if (data.hitCount > 0 &&
             data.entries[0].fields.PDB.indexOf(query.query) !== -1){
    window.requestAnimationFrame(() => {
      router.replace({pathname: `/structure/pdb/${query.query}`});
    });
    return <div>PDB structure found - {query.query}</div>;
  } else if (data.hitCount > 0 &&
             data.entries[0].fields.UNIPROT.indexOf(query.query) !== -1) {
    window.requestAnimationFrame(() => {
      router.replace({pathname: `/protein/uniprot/${query.query}`});
    });
    return <div>UniProt protein found - {query.query}</div>;
  }
  return (
      <Table
        data={{results: data.entries, count: data.hitCount}}
        query={query}
        pathname="/search"
        title="Search Results"
      >
        <Exporter>
          <a href={dataUrl} download="SearchResults.json">JSON</a>
        </Exporter>
        <PageSizeSelector pageSize={query.page_size}/>
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

};
SearchResults.propTypes = {
  data: T.object,
  query: T.object,
  router: T.object,
  dataUrl: T.string,
};

export default withRouter(
  connect((state) => ({dataUrl: state.data.dataUrl}))(SearchResults)
);
