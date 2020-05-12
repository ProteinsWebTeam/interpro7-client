// @flow
import React from 'react';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import style from './style.css';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

import addDomain from '../../../images/ida_screenshot.png';

const f = foundationPartial(style, ipro, fonts);
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const AboutIDA = () => (
  <>
    <section className={f('banner')}>
      <div className={f('image-tool-ida')} />
      <div>
        <h3>InterPro Domain Architecture</h3>
        The InterPro Domain Architecture (IDA) tool allows you to search the
        InterPro database with a particular set of domains, and returns all of
        the domain architectures and associated proteins that match the query.
      </div>
      <SchemaOrgData
        data={{
          name: 'About InterPro Domain Architectures',
          description:
            'he InterPro Domain Architecture (IDA) tool allows to search the InterPro database with a particular set of domains',
        }}
        processData={schemaProcessDataPageSection}
      />
    </section>
    <section>
      <div>
        <h3>How are Domain architectures derived?</h3>
        <p>
          Domain architectures are derived from matches to Pfam Entries. The
          results will show all proteins matching the criteria selected below.
          You can select entries which must be included or excluded from your
          search results. Entries can be selected by either entering a Pfam
          accession, or an InterPro accession if a Pfam entry is integrated with
          it.
        </p>
      </div>
      <div>
        <h4>How to search for proteins with a specific domain architecture?</h4>
        <img src={addDomain} className={f('image-funding')} alt="Add domain" />
        <div className={f('steps-list')}>
          <ol>
            <li>
              <b>Add domain to include</b> button should be clicked to add a
              domain to the search.
            </li>
            <li>More domains can be added to the search if needed.</li>
            <li>
              If the order in which the domains are added is important,{' '}
              <b>Order of domain matters</b> checkbox should be checked.
              <ol style={{ listStyleType: 'lower-alpha' }}>
                <li>
                  When the <i>Order of domains</i> option is selected you can
                  drag the domain to the desired position.
                </li>
              </ol>
            </li>
            <li>
              To exclude a particular domain in the search query,{' '}
              <b>Add domain to exclude</b> button should be clicked to add the
              domain.
            </li>
            <li>
              If the search results should match the exact domains given, the{' '}
              <b>Exact match</b> should be checked or the combination of the
              given domains with any other domain would be shown.
            </li>
            <li>
              At last the proteins with the given domain architecture are shown.
              By default, Pfam entries are shown. It can be changed to show
              InterPro entries by toggling the Pfam checkbox to InterPro and
              vice versa.
            </li>
          </ol>
        </div>
      </div>
    </section>
  </>
);

export default AboutIDA;
