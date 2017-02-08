import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';

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

const pages = [
  {path: '/', exact: true, component: Home},
  {path: '/entry', component: Entry},
  {path: '/protein', component: Protein},
  {path: '/structure', component: Structure},
  {path: '/search/sequence/', component: SequenceSearch},
  {path: '/search', component: Search},
  {path: '/about', component: About},
  {path: '/browse', component: Browse},
  {path: '/help', component: Help},
  {path: '/contact', component: Contact},
  {path: '/settings', component: Settings},
  {path: '/404', component: NotFound},
  {component: NotFound},
];

const Pages = props => {
  const _pathname = props.location.pathname.toLowerCase();
  const Component = pages.find(({path = '', exact}) => (
    exact ? (_pathname === path) : (_pathname.startsWith(path))
  )).component;
  return <Component {...props} />;
};
Pages.propTypes = {
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default connect(({location}) => ({location}))(Pages);
