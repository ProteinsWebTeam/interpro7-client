/* globals require: false */
import {createElement} from 'react';

import Root from 'Root';

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
    component: require('subPages/Entry').default,
    // getComponent(_, cb) {
    //   require.ensure([], () => {
    //     cb(null, require('subPages/Entry').default);
    //   });
    // },
  },
  {
    path: '(.*/)*protein(/.*)*',
    component: require('subPages/Protein').default,
    // getComponent(_, cb) {
    //   require.ensure([], () => {
    //     cb(null, require('subPages/Protein').default);
    //   });
    // },
  },
  {
    path: '(.*/)*structure(/.*)*',
    component: require('subPages/Structure').default,
    // getComponent(_, cb) {
    //   require.ensure([], () => {
    //     cb(null, require('subPages/Structure').default);
    //   });
    // },
  },
];

// Routes to the pages containing dynamic content from the API.
const contentPages = [
  {
    path: '/entry',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('pages/Entry').default);
      });
    },
    childRoutes: [
      ...subPagesTransformer(subPages, 'entry'),
      {
        path: '*',
        getComponent(_, cb) {
          require.ensure([], () => {
            cb(null, require('components/Entry/Summary').default);
          });
        },
      },
    ],
  },
  {
    path: '/protein',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('pages/Protein').default);
      });
    },
    childRoutes: [
      ...subPagesTransformer(subPages, 'protein'),
      {
        path: '*',
        getComponent(_, cb) {
          require.ensure([], () => {
            cb(null, require('components/Protein/Summary').default);
          });
        },
      },
    ],
  },
  {
    path: '/structure',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('pages/Structure').default);
      });
    },
    childRoutes: [
      ...subPagesTransformer(subPages, 'structure'),
      {
        path: '*',
        getComponent(_, cb) {
          require.ensure([], () => {
            cb(null, require('components/Structure/Summary').default);
          });
        },
      },
    ],
  },
  {
    path: '/search',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('pages/Search').default);
      });
    },
    childRoutes: [
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
    path: 'browse',
    getComponent(_, cb) {
      require.ensure([], () => {
        cb(null, require('staticPages/Browse').default);
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
  getIndexRoute(_, cb) {
    require.ensure([], () => {
      cb(null, {component: require('pages/Home').default});
    });
  },
  childRoutes: [...contentPages, ...staticPages, ...otherPages],
};
