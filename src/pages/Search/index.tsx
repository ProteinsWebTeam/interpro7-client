import React, { PropsWithChildren, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import HelpBanner from 'components/Help/HelpBanner';
import InfoBanner from 'components/Help/InfoBanner';
import Button from 'components/SimpleCommonComponents/Button';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
// TODO: consider changing to completely use the Tabs component
import tabs from 'components/Tabs/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(tabs, style, fonts);

const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
  loading: null,
});
const SearchResults = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-results" */ 'components/SearchResults'),
  loading: null,
});
const IPScanSearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-search" */ 'components/IPScan/Search'),
  loading: null,
});
const IDASearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ida-search" */ 'components/SearchByIDA'),
  loading: null,
});
const IDAResults = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ida-results" */ 'components/Entry/DomainArchitectures/IDAResults'
    ),
  loading: null,
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
}: GlobalState) => {
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
  return (
    <Redirect
      to={{
        description: { main: { key: 'search' }, search: { type: 'sequence' } },
      }}
    />
  );
};

type Props = PropsWithChildren<{
  topic: 'TextSearch' | 'InterProScan' | 'IDA';
}>;

const Wrapper = ({ topic, children }: Props) => {
  const [showHelp, setShowHelp] = useState(false);
  const toggleShowHelp = () => setShowHelp(!showHelp);
  return (
    <section>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <SchemaOrgData
        data={{
          name: 'InterPro Search Page',
          description: 'Search InterPro data and website',
          location: window.location,
        }}
        processData={schemaProcessDataWebPage}
      />
      <div>
        <h3>Search InterPro</h3>
        <ul className={css('new-tabs', 'main-style')}>
          <li className={css('tabs-title')}>
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'sequence' },
                },
              }}
              activeClass={css('is-active', 'is-active-tab')}
            >
              by sequence
            </Link>
          </li>
          <li className={css('tabs-title')}>
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
              }) => type === 'text' && css('is-active', 'is-active-tab')}
            >
              by text
            </Link>
          </li>
          <li className={css('tabs-title')}>
            <Link
              to={{
                description: {
                  main: { key: 'search' },
                  search: { type: 'ida' },
                },
              }}
              activeClass={css('is-active', 'is-active-tab')}
            >
              by domain architecture
            </Link>
          </li>
        </ul>
        <div className={css('tab-content')}>
          <div className={css('tabs-panel', 'is-active')}>
            <ErrorBoundary>
              <div className={css('tabs-panel-content')}>
                <div className={css('search-form')}>
                  {Array.isArray(children) ? children[0] : children}
                </div>
                <div>
                  <Button
                    type="inline"
                    onClick={toggleShowHelp}
                    icon="icon-info"
                    style={{
                      color: showHelp ? 'grey' : undefined,
                    }}
                  />
                </div>
                <div className={css('help-col', { removed: !showHelp })}>
                  {
                    <>
                      <InfoBanner topic={topic} />
                      <br />
                      <HelpBanner topic={topic} />
                    </>
                  }
                </div>
              </div>
              {Array.isArray(children) && children.slice(1)}
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
};

const locationSelector = (customLocation: InterProLocation) =>
  customLocation.description.search.type;

const Search = () => (
  <Switch
    locationSelector={locationSelector}
    indexRoute={RedirectToDefault}
    childRoutes={routes}
  />
);

export default Search;
