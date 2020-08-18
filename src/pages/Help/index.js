// @flow
import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import Link from 'components/generic/Link';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import loadable from 'higherOrder/loadable';

import ContentFromRTD from 'components/ContentFromRTD';

import { schemaProcessDataWebPage } from 'schema_org/processors';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);
const Tutorials = () => <ContentFromRTD page="tutorials_webinars.rst" />;
const Faqs = () => <ContentFromRTD page="faq.rst" format="faq" />;
const Training = () => <ContentFromRTD page="training.rst" />;

const Publication = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "help-publication" */ 'components/Help/Publication'
    ),
});

const Documentation = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "help-documentation" */ 'components/Help/Documentation'
    ),
});

const innerRoutes = new Map([['publication', Publication]]);

const innerLocationSelector = createSelector(
  (customLocation) => customLocation.description.other[2],
  (value) => value,
);

class InnerSwitch extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={innerLocationSelector}
          indexRoute={Documentation}
          childRoutes={innerRoutes}
        />
      </ErrorBoundary>
    );
  }
}

const routes = new Map([
  ['tutorial', Tutorials],
  ['training', Training],
  ['faqs', Faqs],
  ['documentation', InnerSwitch],
]);

const locationSelector = createSelector(
  (customLocation) => customLocation.description.other[1],
  (value) => value,
);

const RedirectToDefault = () => (
  <Redirect to={{ description: { other: ['help', 'tutorial'] } }} />
);

export default class Help extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('row')}>
        <Helmet>
          <title>Help</title>
        </Helmet>

        <SchemaOrgData
          data={{
            name: 'InterPro Help Page',
            description: 'Documentation relating to the use of InterPro',
            location: window.location,
          }}
          processData={schemaProcessDataWebPage}
        />
        <div className={f('columns', 'margin-bottom-large')}>
          <ul className={f('tabs', 'menu-style')}>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['help', 'tutorial'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Tutorials &amp; Webinars
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['help', 'training'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Training
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['help', 'faqs'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                FAQs
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['help', 'documentation'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Documentation
              </Link>
            </li>
          </ul>
          <div className={f('tabs', 'tabs-content')}>
            <div className={f('tabs-panel', 'is-active')}>
              <ErrorBoundary>
                <Switch
                  locationSelector={locationSelector}
                  indexRoute={RedirectToDefault}
                  childRoutes={routes}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
