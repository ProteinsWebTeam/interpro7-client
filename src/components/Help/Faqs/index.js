import React, { PureComponent } from 'react';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(local, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export default class Faqs extends PureComponent {
  render() {
    return (
      <section>
        <h3>Frequently asked questions (FAQs)</h3>

        <p>lorem ipsum</p>
      </section>
    );
  }
}
