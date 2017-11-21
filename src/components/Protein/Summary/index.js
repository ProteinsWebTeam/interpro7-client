// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Accession from 'components/Accession';
import Title from 'components/Title';

import { UniProtLink } from 'components/ExtLink';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import DomainsOnProtein from 'components/Related/DomainsOnProtein';

const f = foundationPartial(ebiStyles);

/*:: type Props = {
  data: {
    metadata: Object,
  },
}; */

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
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType="protein" />
              <div className={f('tag', 'secondary', 'margin-bottom-large')}>
                Protein {metadata.source_database}
              </div>
              <Accession accession={metadata.accession} id={metadata.id} />
              <Species taxid={metadata.source_organism.taxid} />
              <Length metadata={metadata} />
            </div>
            <div className={f('medium-2', 'columns')}>
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
              <h4>Domains on Protein</h4>
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
