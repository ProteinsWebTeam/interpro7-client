// @flow
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet-async';

import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import loadable from 'higherOrder/loadable';

import ContentFromRTD from 'components/ContentFromRTD';

import { schemaProcessDataWebPage } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import config from 'config';

const f = foundationPartial(ebiGlobalStyles, ipro);

const TrainingAndTutorials = () => {
  return (
    <Redirect to="https://www.ebi.ac.uk/training/search-results?query=interpro&domain=ebiweb_training&page=1&facets=" />
  );
};
const Faqs = () => <ContentFromRTD page="faq.rst" format="faq" />;
const Game = () => (
  <ContentFromRTD page="protein_families_game.rst" format="faq" />
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const HelpCenter = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "help-center" */ 'components/Help'),
});

const Documentation = () => {
  return <Redirect to={config.root.readthedocs.href} />;
};

const routes = new Map([
  ['tutorial', TrainingAndTutorials],
  ['training', TrainingAndTutorials],
  ['faqs', Faqs],
  ['documentation', Documentation],
  ['protein_families_game', Game],
]);

const locationSelector = (customLocation) =>
  customLocation.description.other[1];

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
                  indexRoute={HelpCenter}
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
