// @flow
import React from 'react';
import T from 'prop-types';

import {UniProtLink} from 'components/ExtLink';

const Accession = (
  {metadata: {accession, id}}/*: {metadata: {accession: string, id: ?string}} */
) => (
  <div>
    Accession: <UniProtLink id={accession} />
    {id && ` (${id})`}
  </div>
);

Accession.propTypes = {
  metadata: T.shape({
    accession: T.string.isRequired,
    id: T.string,
  }).isRequired,
};

export default Accession;
