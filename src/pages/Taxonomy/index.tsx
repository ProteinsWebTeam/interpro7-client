import React, { useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ExactMatchSearch from 'components/Taxonomy/ExactMatchSearch';
import loadable from 'higherOrder/loadable';

import subPages from 'subPages';
import config from 'config';

import EndPointPage from '../endpoint-page';

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "taxonomy-summary" */ 'components/Taxonomy/Summary'
    ),
  loading: false,
});
const ListAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "taxonomy-list" */ 'components/Taxonomy/List'),
  loading: false,
});

const subPagesForTaxonomy = new Map();
for (const subPage of config.pages.taxonomy.subPages as Array<string>) {
  subPagesForTaxonomy.set(subPage, subPages.get(subPage));
}

const childRoutes = /(\d+)|(all)/i;

type Props = {
  search?: InterProLocationSearch;
};
const Taxonomy = ({ search }: Props) => {
  const [accSearch, setAccSearch] = useState<
    TaxonommyTreePayload | null | undefined
  >(null);
  const searchTerm = search && (search.search as string);
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  (search) => ({ search }),
);

export default connect(mapStateToProps)(Taxonomy);
