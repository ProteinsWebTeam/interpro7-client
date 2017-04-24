import React from 'react';
import T from 'prop-types';


const Species = ({metadata}) => (
    <div>Species: {metadata.source_organism.fullname}</div>
  );

Species.propTypes = {
  metadata: T.shape({
    source_organism: T.object.isRequired,
  }).isRequired,
};

export default Species;
