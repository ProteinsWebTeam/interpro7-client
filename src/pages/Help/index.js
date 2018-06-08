import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataInterpro } from 'schema_org/processors';
import {
  schemaProcessDataWebPage,
  schemaProcessDataPageSection,
} from 'schema_org/processors';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const Tutorial = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-consortium" */ 'components/Help/Tutorial'),
});

const Faqs = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-citation" */ 'components/Help/Faqs'),
});

const Documentation = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-funding" */ 'components/Help/Documentation'),
});

const routes = new Map([
  ['tutorial', Tutorial],
  ['faqs', Faqs],
  ['documentation', Documentation],
]);

const locationSelector = createSelector(
  customLocation => customLocation.description.other[1],
  value => value,
);

const RedirectToDefault = () => (
  <Redirect to={{ description: { other: ['help', 'tutorial'] } }} />
);

export default class extends PureComponent /*:: <{}> */ {
  static displayName = 'Help';

  render() {
    return (
      <div className={f('row')}>
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
            <li
              className={f('tabs-title')}
              onMouseOver={Tutorial.preload}
              onFocus={Tutorial.preload}
            >
              <Link
                to={{ description: { other: ['help', 'tutorial'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Tutorials &amp; training
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Faqs.preload}
              onFocus={Faqs.preload}
            >
              <Link
                to={{ description: { other: ['help', 'faqs'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                FAQs
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Documentation.preload}
              onFocus={Documentation.preload}
            >
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
