import React, {PropTypes as T} from 'react';

import TypeTag from 'components/TypeTag';
import {
  Name, OriginDB, SourceOrganism,
} from 'components/SimpleCommonComponents';

import styles from 'styles/blocks.css';

const Title = ({metadata, pathname}) => (
  <div className={styles.card}>
    <h2>{metadata.name.name}</h2>
    <div>
      {metadata.type && <TypeTag type={metadata.type} full={true} />}
      <Name name={metadata.name} accession={metadata.accession} />
      <OriginDB source={metadata.source_database} pathname={pathname} />
      {metadata.gene && <p>Gene: {metadata.gene}</p>}
      {
        metadata.source_organism &&
        <SourceOrganism {...metadata.source_organism} />
      }
    </div>
  </div>
);
Title.propTypes = {
  metadata: T.shape({
    name: T.object.isRequired,
    type: T.string,
    accession: T.string.isRequired,
    source_database: T.string.isRequired,
    gene: T.string,
    source_organism: T.object,
  }).isRequired,
  pathname: T.string.isRequired,
};

export default Title;
