import React from 'react';

import loadable from 'higherOrder/loadable';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { setDBs } from 'utils/processDescription/handlers';

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "set-summary" */ 'components/Set/Summary'),
  loading: undefined,
});

const ListAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "set-list" */ 'components/Set/List'),
  loading: undefined,
});

const subPagesForSet = new Map();
for (const subPage of config.pages.set.subPages) {
  subPagesForSet.set(subPage, subPages.get(subPage));
}

const dbAccs = new RegExp(
  Array.from(setDBs)
    .map((db) => db.re.source)
    .filter((db) => db)
    .join('|'),
  'i',
);

const EntrySet = () => (
  <EndPointPage
    subpagesRoutes={dbAccs}
    listOfEndpointEntities={ListAsync}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForSet}
  />
);

export default EntrySet;
