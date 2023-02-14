// @flow
import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import ContentFromRTD from 'components/ContentFromRTD';

import { schemaProcessDataInterpro } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const AboutInterPro = () => <ContentFromRTD page="interpro.rst" />;
const Consortium = () => <ContentFromRTD page="databases.rst" />;
const Funding = () => <ContentFromRTD page="funding.rst" />;
const Privacy = () => <ContentFromRTD page="privacy.rst" />;
const License = () => <ContentFromRTD page="license.rst" />;
const Team = () => <ContentFromRTD page="team.rst" />;
const InterProScan = () => (
  <ContentFromRTD page="interproscan.rst" format="interproscan" />
);

const routes = new Map([
  ['interpro', AboutInterPro],
  ['interproscan', InterProScan],
  ['consortium', Consortium],
  ['funding', Funding],
  ['privacy', Privacy],
  ['license', License],
  ['team', Team],
]);

const locationSelector = createSelector(
  (customLocation) => customLocation.description.other[1],
  (value) => value,
);

const RedirectToDefault = () => (
  <Redirect to={{ description: { other: ['about', 'interpro'] } }} />
);

class About extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('row')}>
        <Helmet>
          <title>About</title>
        </Helmet>
        <SchemaOrgData
          data={{ location: window.location }}
          processData={schemaProcessDataInterpro}
        />
        <div className={f('columns', 'margin-bottom-large')}>
          <div className={f('tabs', 'tabs-content')}>
            <div className={f('tabs-panel', 'is-active')}>
              <Switch
                locationSelector={locationSelector}
                indexRoute={RedirectToDefault}
                childRoutes={routes}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default loadData(getUrlForMeta)(About);
