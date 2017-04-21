import React from 'react';
import T from 'prop-types';


const Length = ({metadata}) => (
    <div>Length: {metadata.length} amino acids</div>
  );

Length.propTypes = {
  metadata: T.shape({
    length: T.number.isRequired,
  }).isRequired,
};

export default Length;
