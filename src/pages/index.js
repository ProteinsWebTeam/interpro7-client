// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import loadable from 'higherOrder/loadable';

import BrowseTabs from 'components/BrowseTabs';

import { stuckSelector } from 'reducers/ui/stuck';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
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
const Taxonomy = loadable({
  loader: () => import(/* webpackChunkName: "taxonomy-page" */ './Taxonomy'),
});
const Proteome = loadable({
  loader: () => import(/* webpackChunkName: "proteome-page" */ './Proteome'),
});
const EntrySet = loadable({
  loader: () => import(/* webpackChunkName: "set-page" */ './Set'),
});

// Other
const Search = loadable({
  loader: () => import(/* webpackChunkName: "search-page" */ './Search'),
});
const Jobs = loadable({
  loader: () => import(/* webpackChunkName: "jobs-page" */ './Jobs'),
});

// Static pages
const Download = loadable({
  loader: () => import(/* webpackChunkName: "about-page" */ './Download'),
});
const ReleaseNotes = loadable({
  loader: () => import(/* webpackChunkName: "about-page" */ './Release_notes'),
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

const pages = new Map([
  // pages with data from API
  ['entry', Entry],
  ['protein', Protein],
  ['structure', Structure],
  ['taxonomy', Taxonomy],
  ['proteome', Proteome],
  ['set', EntrySet],
  // other
  ['search', Search],
  ['job', Jobs],
]);

// Everything which ends up in the 'other' array of the location description
const otherPages = new Map([
  // static pages
  ['release_notes', ReleaseNotes],
  ['download', Download],
  ['about', About],
  ['help', Help],
  ['contact', Contact],
  ['settings', Settings],
]);

const Null = () => null;

/*:: type Props = {
  stuck: boolean,
  top: number,
}; */

const childRoutes = new Map([[/^search|job$/, Null]]);
const locationSelector1 = createSelector(
  customLocation => {
    if (
      customLocation.description.main.key &&
      !customLocation.description[customLocation.description.main.key].accession
    )
      return customLocation.description.main.key;
  },
  value => value,
);
const locationSelector2 = createSelector(
  customLocation => customLocation.description.main.key,
  value => value,
);
const locationSelectorForOther = createSelector(
  customLocation => customLocation.description.other[0],
  value => value,
);

class HomeOrOther extends PureComponent /*:: <Props> */ {
  render() {
    return (
      <Switch
        {...this.props}
        locationSelector={locationSelectorForOther}
        indexRoute={Home}
        childRoutes={otherPages}
        catchAll={NotFound}
      />
    );
  }
}

export class Pages extends PureComponent /*:: <Props> */ {
  static propTypes = {
    stuck: T.bool.isRequired,
    top: T.number.isRequired,
  };

  render() {
    const { stuck, top, ...props } = this.props;
    return (
      <div className={f('main', { stuck })}>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <Switch
                {...props}
                indexRoute={Null}
                locationSelector={locationSelector1}
                childRoutes={childRoutes}
                catchAll={BrowseTabs}
              />
            </div>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            {...props}
            locationSelector={locationSelector2}
            indexRoute={HomeOrOther}
            childRoutes={pages}
            catchAll={NotFound}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = createSelector(stuckSelector, stuck => ({ stuck }));

export default connect(mapStateToProps)(Pages);
