import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';
import HelpBanner from 'components/Help/HelpBanner';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import style from './style.css';
import InfoBanner from 'components/Help/InfoBanner';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, ipro, style, fonts);

const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
});
const SearchResults = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-results" */ 'components/SearchResults'),
});
const IPScanSearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-search" */ 'components/IPScan/Search'),
});
const IDASearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ida-search" */ 'components/SearchByIDA'),
});
const IDAResults = loadable({
  loader: () =>
    import(/* webpackChunkName: "ida-results" */ 'components/Entry/DomainArchitectures/IDAResults'),
});
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const TextSearchAndResults = () => (
  <Wrapper topic="TextSearch">
    <SearchByText />
    <SearchResults />
  </Wrapper>
);
TextSearchAndResults.preload = () => {
  SearchByText.preload();
  SearchResults.preload();
};

const WrappedIPScanSearch = () => (
  <Wrapper topic="InterProScan">
    <IPScanSearch />
  </Wrapper>
);

const WrappedIDASearch = () => (
  <Wrapper topic="IDA">
    <IDASearch />
    <IDAResults />
  </Wrapper>
);

const routes = new Map([
  ['text', TextSearchAndResults],
  ['sequence', WrappedIPScanSearch],
  ['ida', WrappedIDASearch],
]);

const RedirectToDefault = ({
  customLocation: {
    search: { q: value },
  },
}) => {
  // TODO: after a decent amount of time, remove from here…
  // This logic is only to handle old IP6 URL structure and redirect to new one
  if (typeof value === 'string') {
    return (
      <Redirect
        to={{
          description: {
            main: { key: 'search' },
            search: { type: 'text', value },
          },
        }}
      />
    );
  }
  // TODO: …to there
  return (
    <Redirect
      to={{
        description: { main: { key: 'search' }, search: { type: 'sequence' } },
      }}
    />
  );
};
RedirectToDefault.propTypes = {
  customLocation: T.shape({
    search: T.shape({
      q: T.string,
    }).isRequired,
  }).isRequired,
};

class Wrapper extends PureComponent {
  static propTypes = {
    topic: T.string,
    children: T.node.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showHelp: true,
    };
  }
  toggleShowHelp = () => this.setState({ showHelp: !this.state.showHelp });

  render() {
    return (
      <div className={f('row')}>
        <SchemaOrgData
          data={{
            name: 'InterPro Search Page',
            description: 'Search InterPro data and website',
            location: window.location,
          }}
          processData={schemaProcessDataWebPage}
        />
        <div className={f('columns', 'margin-bottom-large')}>
          <h3>Search InterPro</h3>
          <ul className={f('tabs', 'main-style', 'margin-top-large')}>
            <li
              className={f('tabs-title')}
              onMouseOver={WrappedIPScanSearch.preload}
              onFocus={WrappedIPScanSearch.preload}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'search' },
                    search: { type: 'sequence' },
                  },
                }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                by sequence
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={TextSearchAndResults.preload}
              onFocus={TextSearchAndResults.preload}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'search' },
                    search: { type: 'text' },
                  },
                }}
                activeClass={({
                  description: {
                    search: { type },
                  },
                }) => type === 'text' && f('is-active', 'is-active-tab')}
              >
                by text
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              // onMouseOver={WrappedIPScanSearch.preload}
              // onFocus={WrappedIPScanSearch.preload}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'search' },
                    search: { type: 'ida' },
                  },
                }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                by domain architecture
              </Link>
            </li>
          </ul>
          <div className={f('tabs', 'tabs-content')}>
            <div className={f('tabs-panel', 'is-active')}>
              <ErrorBoundary>
                <div className={f('tabs-panel-content')}>
                  <div style={{ flexGrow: 2 }}>
                    {Array.isArray(this.props.children)
                      ? this.props.children[0]
                      : this.props.children}
                  </div>
                  <div>
                    <button
                      onClick={this.toggleShowHelp}
                      className={f('hollow')}
                    >
                      <span
                        className={f('icon', 'icon-common', 'show-help', {
                          expanded: this.state.showHelp,
                        })}
                        data-icon="&#xf137;"
                      />
                    </button>
                  </div>
                  {this.state.showHelp && (
                    <div>
                      <InfoBanner topic={this.props.topic} />
                      <HelpBanner topic={this.props.topic} />
                    </div>
                  )}
                </div>
                {Array.isArray(this.props.children) &&
                  this.props.children.slice(1)}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const locationSelector = createSelector(
  customLocation => customLocation.description.search.type,
  value => value,
);

const Search = () => (
  <Switch
    locationSelector={locationSelector}
    indexRoute={RedirectToDefault}
    childRoutes={routes}
  />
);

export default Search;
