/* @flow */
import React, {PropTypes as T} from 'react';

import 'pdb-web-components';

import styles from 'styles/blocks.css';

const SummaryStructure = (
  {data: {metadata}}/*: {data: {metadata: Object}} */
) => (
  <div>
    <div className={styles.card}>
      <h2>Summary</h2>
      <pdb-prints size="64">
        <pdb-data-loader pdbid={metadata.accession} />
      </pdb-prints>
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
