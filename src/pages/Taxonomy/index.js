// @flow
/* eslint-disable react/display-name */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadable from 'higherOrder/loadable';

import subPages from 'subPages';
import config from 'config';

import EndPointPage from '../endpoint-page';

const SummaryAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "taxonomy-summary" */ 'components/Taxonomy/Summary'
    ),
});
const ListAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "taxonomy-list" */ 'components/Taxonomy/List'
    ),
});

const subPagesForTaxonomy = new Map();
for (const subPage of config.pages.taxonomy.subPages) {
  subPagesForTaxonomy.set(subPage, subPages.get(subPage));
}

const childRoutes = /(\d+)|(all)/i;

const _ExactMatchSearch = ({ data, onSearchComplete }) => {
  useEffect(() => {
    onSearchComplete(data && !data.loading && data.payload);
  });
  return null;
};

const getURLFromState = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, { search }) => {
    if (search && search.match(/^\d+$/)) {
      const desc = {
        ...description,
        taxonomy: {
          db: 'uniprot',
          accession: search,
        },
      };
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(desc),
        });
      } catch {
        return;
      }
    } else if (search && search.match(/^[\w ]+$/)) {
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(description),
          search: `?scientific_name=${search}`,
        });
      } catch {
        return;
      }
    }
  },
);

const ExactMatchSearch = loadData(getURLFromState)(_ExactMatchSearch);

const Taxonomy = ({ search }) => {
  const [accSearch, setAccSearch] = useState(null);
  const searchTerm = search && search.search;
  return (
    <>
      {searchTerm && <ExactMatchSearch onSearchComplete={setAccSearch} />}
      <EndPointPage
        subpagesRoutes={childRoutes}
        listOfEndpointEntities={ListAsync}
        SummaryAsync={SummaryAsync}
        subPagesForEndpoint={subPagesForTaxonomy}
        exactMatch={(searchTerm && accSearch) || null}
      />
    </>
  );
};
Taxonomy.propTypes = {
  search: T.shape({
    search: T.string,
  }),
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  (search) => ({ search }),
);

export default connect(mapStateToProps)(Taxonomy);
