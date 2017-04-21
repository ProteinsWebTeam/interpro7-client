// @flow
import React from 'react';
import T from 'prop-types';
import Title from 'components/Title';
import {PDBeLink, PDBe3DLink} from 'components/ExtLink';

import f from 'styles/foundation';
import pdbLogo from 'images/pdbe.png';

const SummaryStructure = (
  {data: {metadata}, location: {pathname}}
  /*: {data: {metadata: Object}, location: {pathname: string}} */
) => (
  <div className={f('sections')}>
    <section>
      <div className={f('row')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <Title metadata={metadata} pathname={pathname} />
          <h4>Summary</h4>
          <pdb-prints size="48">
            <pdb-data-loader pdbid={metadata.accession} />
          </pdb-prints>
          {
            metadata.chains &&
            <div>
              <h4>Chains:</h4>
              { metadata.chains.join(', ') }
            </div>
          }
        </div>
        <div className={f('medium-4', 'large-4', 'columns')}>
          <div className={f('panel')}>
            <h5>External Links</h5>
            <ul className={f('chevron')}>
              <li>
                <PDBeLink id={metadata.accession}>
                  <img src={pdbLogo} alt="Uniprot logo" />
                </PDBeLink>
              </li>
            </ul>
            <PDBe3DLink id={metadata.accession}>
              <img
                src={`//www.ebi.ac.uk/pdbe/static/entry/${
                  metadata.accession.toLowerCase()
                  }_entity_1_front_image-400x400.png`}
                alt="structure image"
                style={{maxWidth: '100%'}}
              />
            </PDBe3DLink>
          </div>
        </div>
      </div>
    </section>
  </div>
);
SummaryStructure.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }).isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default SummaryStructure;
