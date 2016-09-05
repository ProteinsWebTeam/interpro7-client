/* @flow */
import React, {PropTypes as T} from 'react';

import PDBPrints from 'components/Structure/PDBPrints';

import styles from 'styles/blocks.css';

const SummaryStructure = (
  {data: {metadata}}/*: {data: {metadata: Object}} */
) => (
  <div>
    <div className={styles.card}>
      <h2>Summary</h2>
      <PDBPrints accession={metadata.accession} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <img
          src={`//www.ebi.ac.uk/pdbe/static/entry/${
            metadata.accession.toLowerCase()
          }_entity_1_front_image-800x800.png`}
          alt="structure image"
          style={{maxWidth: '100%'}}
        />
      </div>
    </div>
  </div>
);
SummaryStructure.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }).isRequired,
};

export default SummaryStructure;
