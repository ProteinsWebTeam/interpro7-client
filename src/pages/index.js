// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import loadable from 'higherOrder/loadable';

import BrowseTabs from 'components/BrowseTabs';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import ipro from 'styles/interpro-new.css';
import style from './style.css';

const f = foundationPartial(ebiGlobalStyles, ipro, style);

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
const EntrySet = loadable({
  loader: () => import(/* webpackChunkName: "organism-page" */ './Set'),
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
  { value: 'set', component: EntrySet },
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
      <main className={f('main', { stuck })}>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <Switch
                {...props}
                indexRoute={Null}
                locationSelector={l =>
                  l.description.main.key &&
                  !l.description[l.description.main].accession
                }
                childRoutes={[{ value: 'search', component: Null }]}
                catchAll={BrowseTabs}
              />
            </div>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            {...props}
            locationSelector={l =>
              l.description.other[0] || l.description.main.key
            }
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
