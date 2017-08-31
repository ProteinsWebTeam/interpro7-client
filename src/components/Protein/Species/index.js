// @flow
import React from 'react';
import T from 'prop-types';

import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

const Species = (
  {
    metadata: { source_organism: { taxid } },
  } /*: {metadata: {source_organism: {fullname: string, taxid: number}}} */
) => (
  <div>
    {'Species: '}
    <Metadata endpoint="organism" db="taxonomy" accession={taxid}>
      <TaxIdOrName accession={taxid} />
    </Metadata>
  </div>
);

Species.propTypes = {
  metadata: T.shape({
    source_organism: T.shape({
      fullname: T.string.isRequired,
      taxid: T.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Species;
