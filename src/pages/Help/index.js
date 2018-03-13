// @flow
import React, { PureComponent } from 'react';
import { foundationPartial } from 'styles/foundation';
import loadable from 'higherOrder/loadable';
import {
  schemaProcessDataWebPage,
  schemaProcessDataPageSection,
} from 'schema_org/processors';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const f = foundationPartial();

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
        <div className={f('columns', 'large-12')}>
          <section>
            <h3>Help</h3>
          </section>
          <section>
            <h4>FAQs</h4>
            <SchemaOrgData
              data={{
                name: 'FAQS',
                description:
                  'Answers to many of the most commonly asked questions',
              }}
              processData={schemaProcessDataPageSection}
            />
            <p>
              All documentation relating to the use of the InterPro has been
              moved to Read the Docs. This allows us to provide a rich,
              searchable and downloadable document, as well as enables us to
              store different versions corresponding to the different InterPro
              releases.{' '}
            </p>
            <p>
              Answers to many of the most commonly asked questions can be found
              under the FAQ section.
            </p>
          </section>
          <section>
            <h4>Training & material</h4>
            <SchemaOrgData
              data={{
                name: 'Training & material',
                description:
                  'training materials as part of the EBI Train online',
              }}
              processData={schemaProcessDataPageSection}
            />
            <p>
              There are also the following training materials as part of the EBI
              Train online
            </p>
            <ul>
              <li>
                InterPro: functional and structural analysis of protein
                sequences
              </li>
              <li>
                Protein classification: An introduction to EMBL-EBI resources
              </li>
              <li>A Quick Tour of InterPro</li>
            </ul>
          </section>
          <section>
            <h4>Support & feedback</h4>
            <SchemaOrgData
              data={{
                name: 'Support & feedback',
                description: 'contact us by email',
              }}
              processData={schemaProcessDataPageSection}
            />
            <p>
              You can contact us by email following this link to the EBI contact
              form, if neither the documentation nor online materials answer
              your question.
            </p>
          </section>
        </div>
      </div>
    );
  }
}
