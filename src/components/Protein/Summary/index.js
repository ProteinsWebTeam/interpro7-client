// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import { UniProtLink } from 'components/ExtLink';
import DomainsOnProtein from 'components/Related/DomainsOnProtein';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import loadable from 'higherOrder/loadable';
import { isTranscribedFrom } from 'schema_org/processors';

const f = foundationPartial(ebiStyles);

/*:: type Props = {
  data: {
    metadata: Object,
  },
}; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class SummaryProtein extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
  };

  render() {
    const { data } = this.props;
    const metadata = data.metadata;
    return (
      <div className={f('sections')}>
        {metadata.gene && (
          <SchemaOrgData
            data={{ gene: metadata.gene }}
            processData={isTranscribedFrom}
          />
        )}
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              Short name: {metadata.id}
              <Species taxID={metadata.source_organism.taxId} />
              <Length metadata={metadata} />
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    <UniProtLink id={metadata.accession} className={f('ext')}>
                      View this protein in UniProtKB
                    </UniProtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={f('row')}>
            <div className={f('medium-12', 'columns', 'margin-bottom-large')}>
              {
                // <h4>Domains on Protein</h4>
              }
              <DomainsOnProtein mainData={data} />
            </div>
          </div>
        </section>
        <GoTerms terms={metadata.go_terms} type="protein" />
      </div>
    );
  }
}

export default SummaryProtein;
