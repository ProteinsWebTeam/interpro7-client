import React from 'react';

import {Switch, Route} from 'react-router-dom';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

// Main pages
const Home = createAsyncComponent(() => import('pages/Home'));
const Entry = createAsyncComponent(() => import('pages/Entry'));
const Protein = createAsyncComponent(() => import('pages/Protein'));
const Structure = createAsyncComponent(() => import('pages/Structure'));
// Search
const SequenceSearch = createAsyncComponent(
  () => import('staticPages/SequenceSearch')
);
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

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/entry" component={Entry} />
    <Route path="/protein" component={Protein} />
    <Route path="/structure" component={Structure} />
    <Route path="/search/sequence/:job" component={SequenceSearch} />
    <Route path="/search" component={Search} />
    <Route path="/about" component={About} />
    <Route path="/browse" component={Browse} />
    <Route path="/help" component={Help} />
    <Route path="/contact" component={Contact} />
    <Route path="/settings" component={Settings} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>
);
