import React from 'react';

import Switch from 'components/generic/Switch';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

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
  {path: 'entry', component: Entry},
  {path: 'protein', component: Protein},
  {path: 'structure', component: Structure},
  {path: 'search', component: Search},
  {path: 'about', component: About},
  {path: 'browse', component: Browse},
  {path: 'help', component: Help},
  {path: 'contact', component: Contact},
  {path: 'settings', component: Settings},
  {path: '404', component: NotFound},
]);

const Pages = props => (
  <Switch
    indexRoute={Home}
    childRoutes={pages}
    catchAll={NotFound}
    {...props}
  />
);

export default Pages;
