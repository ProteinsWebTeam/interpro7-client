// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export default class Privacy extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h3>Privacy</h3>
        <SchemaOrgData
          data={{
            name: 'InterPro Privacy Policy',
            description:
              'Our privacy policy complies with the changes brought by the GDPR law',
          }}
          processData={schemaProcessDataPageSection}
        />{' '}
        <p>
          Our privacy policy complies with the changes brought by the European
          Union data protection law (GDPR). You can find more information on the{' '}
          <Link
            href="//www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
            className={f('ext')}
            target="_blank"
          >
            Privacy Notice for EMBL-EBI Public Website
          </Link>
          . If you have any questions about this privacy policy, please{' '}
          <Link
            href="//www.ebi.ac.uk/support/interpro"
            className={f('ext')}
            target="_blank"
            withReferrer
          >
            contact us via EBI support
          </Link>
          .{' '}
        </p>
      </section>
    );
  }
}
