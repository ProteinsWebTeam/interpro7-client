// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Sequence from 'components/Protein/Sequence';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Accession from 'components/Accession';
import Title from 'components/Title';
import { UniProtLink } from 'components/ExtLink';
import f from 'styles/foundation';
import uniprotLogo from 'images/uniprot.png';

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
    const { data: { metadata } } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType={'protein'} />
              <div className={f('tag', 'margin-bottom-medium')}>
                {metadata.source_database}
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
                    <UniProtLink id={metadata.accession}>
                      <img src={uniprotLogo} alt="Uniprot logo" />
                    </UniProtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <Sequence accession={metadata.accession} sequence={metadata.sequence} />
        <GoTerms terms={metadata.go_terms} />
      </div>
    );
  }
}

export default SummaryProtein;
