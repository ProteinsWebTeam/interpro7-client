// @flow
import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import Link from 'components/generic/Link';
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
const Team = () => <ContentFromRTD page="team.rst" />;
const InterProScan = () => (
  <ContentFromRTD page="interproscan.rst" format="interproscan" />
);

// const InterProScan = loadable({
//   loader: () =>
//     import(
//       /* webpackChunkName: "about-interproscan" */ 'components/About/InterProScan'
//     ),
// });

const routes = new Map([
  ['interpro', AboutInterPro],
  ['interproscan', InterProScan],
  ['consortium', Consortium],
  ['funding', Funding],
  ['privacy', Privacy],
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
          <ul className={f('tabs', 'menu-style')}>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'interpro'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                InterPro
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'interproscan'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                InterProScan
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'consortium'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                The InterPro Consortium
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'funding'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Funding
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'privacy'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Privacy
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{ description: { other: ['about', 'team'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Team
              </Link>
            </li>
          </ul>
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
