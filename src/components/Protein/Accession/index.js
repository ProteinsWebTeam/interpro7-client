import React from 'react';
import T from 'prop-types';


const Accession = ({metadata}) => (
    <div>Accession:&nbsp;
      <a href={`//www.uniprot.org/uniprot/${metadata.accession}`}>
        {metadata.accession}
      </a> ({metadata.id})
    </div>
);

Accession.propTypes = {
  metadata: T.shape({
    accession: T.string.isRequired,
    id: T.string.isRequired,
  }).isRequired,
};

export default Accession;
