// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import loadable from 'higherOrder/loadable';

import BrowseTabs from 'components/BrowseTabs';
// Main pages
const Home = loadable({
  loader: () => import(/* webpackChunkName: "home-page" */ './Home'),
});
const Entry = loadable({
  loader: () => import(/* webpackChunkName: "entry-page" */ './Entry'),
});
const Protein = loadable({
  loader: () => import(/* webpackChunkName: "protein-page" */ './Protein'),
});
const Structure = loadable({
  loader: () => import(/* webpackChunkName: "structure-page" */ './Structure'),
});
const Organism = loadable({
  loader: () => import(/* webpackChunkName: "organism-page" */ './Organism'),
});

// Static pages
const Search = loadable({
  loader: () => import(/* webpackChunkName: "search-page" */ './Search'),
});
const About = loadable({
  loader: () => import(/* webpackChunkName: "about-page" */ './About'),
});
const Help = loadable({
  loader: () => import(/* webpackChunkName: "help-page" */ './Help'),
});
const Contact = loadable({
  loader: () => import(/* webpackChunkName: "contact-page" */ './Contact'),
});
const Settings = loadable({
  loader: () => import(/* webpackChunkName: "settings-page" */ './Settings'),
});

const NotFound = loadable({
  loader: () =>
    import(/* webpackChunkName: "not-found-page" */ './error/NotFound'),
});

const pages = new Set([
  // pages with data from API
  { value: 'entry', component: Entry },
  { value: 'protein', component: Protein },
  { value: 'structure', component: Structure },
  { value: 'organism', component: Organism },
  // static pages
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
        <ErrorBoundary>
          <Switch
            {...props}
            indexRoute={Null}
            locationSelector={l => l.description.mainType}
            childRoutes={[{ value: 'search', component: Null }]}
            catchAll={BrowseTabs}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            {...props}
            locationSelector={l =>
              l.description.other || l.description.mainType}
            indexRoute={Home}
            childRoutes={pages}
            catchAll={NotFound}
          />
        </ErrorBoundary>
      </main>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  stuck => ({ stuck }),
);

export default connect(mapStateToProps)(Pages);
