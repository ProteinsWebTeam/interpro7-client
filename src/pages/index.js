// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import loadable from 'higherOrder/loadable';

import BreadCrumbs from 'components/BreadCrumbs';

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
const Coronavirus = loadable({
  loader: () =>
    import(/* webpackChunkName: "coronavirus-page" */ './Coronavirus'),
});
const FavouriteUpdates = loadable({
  loader: () =>
    import(/* webpackChunkName: "coronavirus-page" */ './FavouriteUpdates'),
});

const RedirectToBlog = ({
  customLocation: {
    description: { other },
  },
}) => {
  const href = 'https://proteinswebteam.github.io/interpro-blog/';
  const archive =
    'https://proteinswebteam.github.io/interpro-blog/2013/09/01/Previous-InterPro-protein-focus-articles/';
  if (other?.[0] === 'potm') {
    if ((other?.[1] || '').toLowerCase() === 'archive.html') {
      window.location.replace(archive);
      return null;
    }
    window.location.replace(`${href}/${other.join('/')}`);
  } else if ((other?.[2] || '').endsWith('.pdf')) {
    const parts = other[2].replace('.pdf', '').split('_');
    const path = `potm/20${parts[2]}_${parts[3]}/${other[2]}`;
    window.location.replace(`${href}/${path}`);
  }
  return null;
};
RedirectToBlog.propTypes = {
  customLocation: T.shape({
    description: T.shape({
      other: T.arrayOf(T.string),
    }),
  }),
};

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
  ['result', Jobs],
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
  ['covid-19', Coronavirus],
  ['fav-updates', FavouriteUpdates],
  ['potm', RedirectToBlog],
  ['downloads', RedirectToBlog],
]);

/*:: type Props = {
  stuck: boolean,
  top: number,
}; */

const locationSelector2 = createSelector(
  (customLocation) => customLocation.description.main.key,
  (value) => value,
);
const locationSelectorForOther = createSelector(
  (customLocation) => customLocation.description.other[0],
  (value) => value,
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
          <div className={f('row', 'large-12', 'columns', 'breadcrumb')}>
            <BreadCrumbs />
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

const mapStateToProps = createSelector(stuckSelector, (stuck) => ({ stuck }));

export default connect(mapStateToProps)(Pages);
