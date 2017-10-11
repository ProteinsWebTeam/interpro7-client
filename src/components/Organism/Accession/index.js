// @flow
import React from 'react';
import T from 'prop-types';

import { TaxLink } from 'components/ExtLink';

const Accession = (
  {
    metadata: { accession, id },
  } /*: {metadata: {accession: string | number, id: ?string}} */,
) => (
  <div>
    Accession: <TaxLink id={accession}>{accession}</TaxLink>
    {id && ` (${id})`}
  </div>
);

Accession.propTypes = {
  metadata: T.shape({
    accession: T.oneOfType([T.string, T.number]).isRequired,
    id: T.string,
  }).isRequired,
};

export default Accession;
