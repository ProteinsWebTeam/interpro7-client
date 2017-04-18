import React, {PropTypes as T} from 'react';
import styles from 'styles/blocks.css';


const Species = ({metadata, pathname}) => {
  return (
    <div>Species: {metadata.source_organism.fullname}</div>
  )};

Species.propTypes = {
  metadata: T.shape({
    source_organism: T.object.isRequired
  }).isRequired,
  pathname: T.string.isRequired,
};

export default Species;
