// @flow
import React from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Sequence from 'components/Protein/Sequence';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Accession from 'components/Protein/Accession';
import Title from 'components/Title';
import {UniProtLink} from 'components/ExtLink';
import f from 'styles/foundation';
import uniprotLogo from 'images/uniprot.png';

const SummaryProtein = (
  {data: {metadata}}/*: {data: {metadata: Object}} */
) => (
  <div className={f('sections')}>
    <section>
      <div className={f('row')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <Title metadata={metadata} mainType={'protein'} />
          <Accession metadata={metadata} />
          <Species metadata={metadata} />
          <Length metadata={metadata} />
        </div>
        <div className={f('medium-4', 'large-4', 'columns')}>
          <div className={f('panel')}>
            <h5>External Links</h5>
            <ul className={f('chevron')}>
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
SummaryProtein.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }).isRequired,
};

export default SummaryProtein;
