import React, {PropTypes as T} from 'react';


const Length = ({metadata}) => (
    <div>Length: {metadata.length} amino acids</div>
  );

Length.propTypes = {
  metadata: T.shape({
    length: T.number.isRequired,
  }).isRequired,
};

export default Length;
