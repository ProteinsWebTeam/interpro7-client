import React from 'react';

import Switch from 'components/generic/Switch';
import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

// Main pages
const Home = createAsyncComponent(() => import('pages/Home'));
const Entry = createAsyncComponent(() => import('pages/Entry'));
const Protein = createAsyncComponent(() => import('pages/Protein'));
const Structure = createAsyncComponent(() => import('pages/Structure'));
// Search
// const SequenceSearch = createAsyncComponent(
//   () => import('staticPages/SequenceSearch')
// );
const Search = createAsyncComponent(() => import('staticPages/Search'));
// Static pages
const About = createAsyncComponent(() => import('staticPages/About'));
const Browse = createAsyncComponent(() => import('staticPages/Browse'));
const Help = createAsyncComponent(() => import('staticPages/Help'));
const Contact = createAsyncComponent(() => import('staticPages/Contact'));
const Settings = createAsyncComponent(() => import('staticPages/Settings'));

const NotFound = createAsyncComponent(
  () => import('staticPages/error/NotFound')
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

export default props => (
  <Switch
    indexRoute={Home}
    childRoutes={pages}
    catchAll={NotFound}
    {...props}
  />
);
