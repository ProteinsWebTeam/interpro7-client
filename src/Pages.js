// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Switch from 'components/generic/Switch';
import loadable from 'higherOrder/loadable';

import BrowseTabs from 'components/BrowseTabs';
// Main pages
const Home = loadable({
  loader: () => import(/* webpackChunkName: "home" */ 'pages/Home'),
});
const Entry = loadable({
  loader: () => import(/* webpackChunkName: "entry-page" */ 'pages/Entry'),
});
const Protein = loadable({
  loader: () => import(/* webpackChunkName: "protein-page" */ 'pages/Protein'),
});
const Structure = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-page" */ 'pages/Structure'),
});
const Organism = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-page" */ 'pages/Organism'),
});

// Static pages
const Search = loadable({
  loader: () => import(/* webpackChunkName: "search" */ 'staticPages/Search'),
});
const About = loadable({
  loader: () => import(/* webpackChunkName: "about" */ 'staticPages/About'),
});
const Help = loadable({
  loader: () => import(/* webpackChunkName: "help" */ 'staticPages/Help'),
});
const Contact = loadable({
  loader: () => import(/* webpackChunkName: "contact" */ 'staticPages/Contact'),
});
const Settings = loadable({
  loader: () =>
    import(/* webpackChunkName: "settings" */ 'staticPages/Settings'),
});

const NotFound = loadable({
  loader: () =>
    import(/* webpackChunkName: "not-found" */ 'staticPages/error/NotFound'),
});

const pages = new Set([
  { value: 'entry', component: Entry },
  { value: 'protein', component: Protein },
  { value: 'structure', component: Structure },
  { value: 'organism', component: Organism },
  { value: 'search', component: Search },
  { value: 'about', component: About },
  { value: 'help', component: Help },
  { value: 'contact', component: Contact },
  { value: 'settings', component: Settings },
]);

const Null = () => null;

/*:: type Props = {
  stuck: boolean,
  top: number,
}; */

class Pages extends PureComponent /*:: <Props> */ {
  static propTypes = {
    stuck: T.bool.isRequired,
    top: T.number.isRequired,
  };

  render() {
    const { stuck, top, ...props } = this.props;
    return (
      <main style={{ marginTop: stuck ? '174px' : 0 }}>
        <Switch
          {...props}
          indexRoute={Null}
          locationSelector={l => l.description.mainType}
          childRoutes={[{ value: 'search', component: Null }]}
          catchAll={BrowseTabs}
        />
        <Switch
          {...props}
          locationSelector={l => l.description.other || l.description.mainType}
          indexRoute={Home}
          childRoutes={pages}
          catchAll={NotFound}
        />
      </main>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  stuck => ({ stuck })
);

export default connect(mapStateToProps)(Pages);
