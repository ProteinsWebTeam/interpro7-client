import React, {PropTypes as T} from 'react';
import styles from 'styles/blocks.css';


const Accession = ({metadata, pathname}) => {
  return (
    <div>Accession: <a href={"//www.uniprot.org/uniprot/" + metadata.accession}>{metadata.accession}</a> ({metadata.id})</div>
)};

Accession.propTypes = {
  metadata: T.shape({
    accession: T.string.isRequired,
    id: T.string.isRequired
  }).isRequired,
    pathname: T.string.isRequired,
};

export default Accession;
