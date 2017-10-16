// @flow
import React from 'react';
import T from 'prop-types';

import { TaxLink } from 'components/ExtLink';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
const f = foundationPartial(ipro);

const Accession = (
  {
    metadata: { accession, id },
  } /*: {metadata: {accession: string | number, id: ?string}} */,
) => (
  <div>
    Accession:{' '}
    <TaxLink id={accession} className={f('ext')}>
      {accession}
    </TaxLink>
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
