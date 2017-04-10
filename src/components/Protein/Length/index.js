// @flow
import React, {PropTypes as T} from 'react';
import styles from 'styles/blocks.css';


const Length = ({metadata, pathname}) => {
  return (
    <div>Length: {metadata.length} amino acids</div>
  )};

Length.propTypes = {
  metadata: T.shape({
    length: T.number.isRequired
  }).isRequired,
  pathname: T.string.isRequired,
};

export default Length;
