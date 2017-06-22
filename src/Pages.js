// @flow
import React from 'react';

import Switch from 'components/generic/Switch';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import BrowseTabs from 'components/BrowseTabs';
// Main pages
const Home = createAsyncComponent(
  () => import(/* webpackChunkName: "home" */'pages/Home')
);
const Entry = createAsyncComponent(
  () => import(/* webpackChunkName: "entry-page" */'pages/Entry')
);
const Protein = createAsyncComponent(
  () => import(/* webpackChunkName: "protein-page" */'pages/Protein')
);
const Structure = createAsyncComponent(
  () => import(/* webpackChunkName: "structure-page" */'pages/Structure')
);
// Search
// const SequenceSearch = createAsyncComponent(
//   () => import('staticPages/SequenceSearch')
// );
const Search = createAsyncComponent(
  () => import(/* webpackChunkName: "search" */'staticPages/Search')
);
// Static pages
const About = createAsyncComponent(
  () => import(/* webpackChunkName: "about" */'staticPages/About')
);
const Browse = createAsyncComponent(
  () => import(/* webpackChunkName: "browse" */'staticPages/Browse')
);
const Help = createAsyncComponent(
  () => import(/* webpackChunkName: "help" */'staticPages/Help')
);
const Contact = createAsyncComponent(
  () => import(/* webpackChunkName: "contact" */'staticPages/Contact')
);
const Settings = createAsyncComponent(
  () => import(/* webpackChunkName: "settings" */'staticPages/Settings')
);

const NotFound = createAsyncComponent(
  () => import(/* webpackChunkName: "not-found" */'staticPages/error/NotFound')
);

const pages = new Set([
  {value: 'entry', component: Entry},
  {value: 'protein', component: Protein},
  {value: 'structure', component: Structure},
  {value: 'search', component: Search},
  {value: 'about', component: About},
  {value: 'browse', component: Browse},
  {value: 'help', component: Help},
  {value: 'contact', component: Contact},
  {value: 'settings', component: Settings},
]);

const Pages = (props/*: Object */) => (
  <div>
    <Switch
      {...props}
      indexRoute={() => null}
      locationSelector={l => l.description.mainAccession}
      catchAll={BrowseTabs}
    />
    <Switch
      {...props}
      locationSelector={l => l.description.other || l.description.mainType}
      indexRoute={Home}
      childRoutes={pages}
      catchAll={NotFound}
    />
  </div>
);

export default Pages;
