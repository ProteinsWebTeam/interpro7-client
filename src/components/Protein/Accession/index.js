import React, {PropTypes as T} from 'react';


const Accession = ({metadata}) => (
    <div>Accession:
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
