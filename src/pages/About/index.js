import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataInterpro } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const Consortium = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-consortium" */ 'components/About/Consortium'),
});

const Citation = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-citation" */ 'components/About/Citation'),
});

const Funding = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-funding" */ 'components/About/Funding'),
});

const Privacy = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-funding" */ 'components/About/Privacy'),
});

const Advanced = loadable({
  loader: () =>
    import(/* webpackChunkName: "about-advanced" */ 'components/About/Advanced'),
});

const routes = new Map([
  ['consortium', Consortium],
  ['citation', Citation],
  ['funding', Funding],
  ['privacy', Privacy],
  ['advanced', Advanced],
]);

const locationSelector = createSelector(
  customLocation => customLocation.description.other[1],
  value => value,
);

const RedirectToDefault = () => (
  <Redirect to={{ description: { other: ['about', 'consortium'] } }} />
);

class About extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('row')}>
        <SchemaOrgData
          data={{ location: window.location }}
          processData={schemaProcessDataInterpro}
        />
        <div className={f('columns', 'margin-bottom-large')}>
          <ul className={f('tabs', 'menu-style')}>
            <li
              className={f('tabs-title')}
              onMouseOver={Consortium.preload}
              onFocus={Consortium.preload}
            >
              <Link
                to={{ description: { other: ['about', 'consortium'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                The InterPro Consortium
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Citation.preload}
              onFocus={Citation.preload}
            >
              <Link
                to={{ description: { other: ['about', 'citation'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                How to cite
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Funding.preload}
              onFocus={Funding.preload}
            >
              <Link
                to={{ description: { other: ['about', 'funding'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Funding
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Privacy.preload}
              onFocus={Privacy.preload}
            >
              <Link
                to={{ description: { other: ['about', 'privacy'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Privacy
              </Link>
            </li>
            <li
              className={f('tabs-title')}
              onMouseOver={Advanced.preload}
              onFocus={Advanced.preload}
            >
              <Link
                to={{ description: { other: ['about', 'advanced'] } }}
                activeClass={f('is-active', 'is-active-tab')}
              >
                Advanced
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
