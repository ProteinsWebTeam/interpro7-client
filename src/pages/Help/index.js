// @flow
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet-async';

import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import loadable from 'higherOrder/loadable';

import ContentFromRTD from 'components/ContentFromRTD';

import { schemaProcessDataWebPage } from 'schema_org/processors';

const SchemaOrgData = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);
const Tutorials = () => <ContentFromRTD page="tutorials_webinars.rst" />;
const Faqs = () => <ContentFromRTD page="faq.rst" format="faq" />;
const Training = () => <ContentFromRTD page="training.rst" />;
const Game = () => (
  <ContentFromRTD page="protein_families_game.rst" format="faq" />
);

// FlowFix me comment needed for async components
const Documentation = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "help-documentation" */
      // $FlowFixMe
      'components/Help/Documentation'
    ),
  loading: () => null,
});

const routes = new Map([
  ['tutorial', Tutorials],
  ['training', Training],
  ['faqs', Faqs],
  ['documentation', Documentation],
  ['protein_families_game', Game],
]);

const locationSelector = (customLocation) =>
  customLocation.description.other[1];

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
