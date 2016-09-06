/* globals require: false */
import {createElement} from 'react';

import Root from 'Root';
import Home from 'pages/Home';
import Entry from 'pages/Entry';
import Protein from 'pages/Protein';
import Structure from 'pages/Structure';

import EntrySub from 'subPages/Entry';
import ProteinSub from 'subPages/Protein';
import StructureSub from 'subPages/Structure';

import EntrySummary from 'components/Entry/Summary';
import ProteinSummary from 'components/Protein/Summary';
import StructureSummary from 'components/Structure/Summary';

import NotFound from 'staticPages/error/NotFound';

import {DEV} from 'config';

const subPagesTransformer = (subPages, main) => subPages
  // Remove subPage matching the main page
  .filter(({path}) => !path.includes(main))
  .map(({path, component}) => ({
    path,
    component: ({data, ...props}) => (
      // If no data, don't render
      // Inject type of the main page inside the subPage
      data && createElement(component, {data, ...props, main})
    ),
  }));

// TODO: check how to define a prefix for the URL (is base tag in head enough?)
// TODO: implement code-splitting, separating by main routes

// Routes for the subpages/tabs that will be used for every main page
// (removing the subpage corresponding to the page below in the code)
const subPages = [
  {
    path: '(.*/)*entry(/.*)*',
    component: EntrySub,
  },
  {
    path: '(.*/)*protein(/.*)*',
    component: ProteinSub,
  },
  {
    path: '(.*/)*structure(/.*)*',
    component: StructureSub,
  },
];

// Routes to the pages containing dynamic content from the API.
const contentPages = [
  {
    path: '/entry',
    components: Entry,
    childRoutes: [
      ...subPagesTransformer(subPages, 'entry'),
      {
        path: '*',
        component: EntrySummary,
      },
    ],
  },
  {
    path: '/protein',
    component: Protein,
    childRoutes: [
      ...subPagesTransformer(subPages, 'protein'),
      {
        path: '*',
        component: ProteinSummary,
      },
    ],
  },
  {
    path: '/structure',
    component: Structure,
    childRoutes: [
      ...subPagesTransformer(subPages, 'structure'),
      {
        path: '*',
        component: StructureSummary,
      },
    ],
  },
];

// Routes to static pages of the website
const staticPages = [
  {
    path: 'about',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('staticPages/About').default);
      });
    },
  },
  {
    path: 'help',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('staticPages/Help').default);
      });
    },
  },
  {
    path: 'contact',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('staticPages/Contact').default);
      });
    },
  },
  {
    path: 'settings',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('staticPages/Settings').default);
      });
    },
  },
];

// Errors and redirects
const otherPages = [
  {
    path: '404',
    component: NotFound,
  },
  // If DEV, don't redirect
  {
    path: '*',
    // Redirect all that didn't match any existing route to 404 page
    onEnter(_/*: void */, replace/*: (x: str) => void */) {
      if (!DEV) replace('/404');
    },
    component: DEV ? NotFound : null,
  },
];

export default {
  path: '/',
  component: Root,
  indexRoute: {component: Home},
  childRoutes: [...contentPages, ...staticPages, ...otherPages],
};
