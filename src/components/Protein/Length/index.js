// @flow
import React, {PropTypes as T} from 'react';
import styles from 'styles/blocks.css';

const Length = ({metadata, pathname}) => (
    <div>Length: {metadata.length} amino acids {metadata.fragment === "N" ? '(complete)' : '(fragment)'}</div>
  );

Length.propTypes = {
  metadata: T.shape({
    length: T.number.isRequired
  }).isRequired,
  pathname: T.string.isRequired,
};

export default Length;
