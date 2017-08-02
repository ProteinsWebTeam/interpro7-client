// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Switch from 'components/generic/Switch';
import { createAsyncComponent } from 'utilityComponents/AsyncComponent';

import BrowseTabs from 'components/BrowseTabs';
// Main pages
const Home = createAsyncComponent(() =>
  import(/* webpackChunkName: "home" */ 'pages/Home'),
);
const Entry = createAsyncComponent(() =>
  import(/* webpackChunkName: "entry-page" */ 'pages/Entry'),
);
const Protein = createAsyncComponent(() =>
  import(/* webpackChunkName: "protein-page" */ 'pages/Protein'),
);
const Structure = createAsyncComponent(() =>
  import(/* webpackChunkName: "structure-page" */ 'pages/Structure'),
);

// Static pages
const Search = createAsyncComponent(() =>
  import(/* webpackChunkName: "search" */ 'staticPages/Search'),
);
const About = createAsyncComponent(() =>
  import(/* webpackChunkName: "about" */ 'staticPages/About'),
);
const Browse = createAsyncComponent(() =>
  import(/* webpackChunkName: "browse" */ 'staticPages/Browse'),
);
const Help = createAsyncComponent(() =>
  import(/* webpackChunkName: "help" */ 'staticPages/Help'),
);
const Contact = createAsyncComponent(() =>
  import(/* webpackChunkName: "contact" */ 'staticPages/Contact'),
);
const Settings = createAsyncComponent(() =>
  import(/* webpackChunkName: "settings" */ 'staticPages/Settings'),
);

const NotFound = createAsyncComponent(() =>
  import(/* webpackChunkName: "not-found" */ 'staticPages/error/NotFound'),
);

const pages = new Set([
  { value: 'entry', component: Entry },
  { value: 'protein', component: Protein },
  { value: 'structure', component: Structure },
  { value: 'search', component: Search },
  { value: 'about', component: About },
  { value: 'browse', component: Browse },
  { value: 'help', component: Help },
  { value: 'contact', component: Contact },
  { value: 'settings', component: Settings },
]);

const Pages = ({ stuck, top, ...props } /*: Object */) =>
  <main style={{ marginTop: stuck ? '198.75px' : 0 }}>
    <Switch
      {...props}
      indexRoute={() => null}
      locationSelector={l => l.description.mainType}
      catchAll={BrowseTabs}
    />
    <Switch
      {...props}
      locationSelector={l => l.description.other || l.description.mainType}
      indexRoute={Home}
      childRoutes={pages}
      catchAll={NotFound}
    />
  </main>;
Pages.propTypes = {
  stuck: T.bool.isRequired,
  top: T.number.isRequired,
};

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  stuck => ({ stuck }),
);

export default connect(mapStateToProps)(Pages);
