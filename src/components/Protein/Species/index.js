// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

const Species = (
  {
    metadata: { source_organism: { fullname, taxid } },
  } /*: {metadata: {source_organism: {fullname: string, taxid: number}}} */,
) => {
  const newTo = {
    description: {
      mainType: 'organism',
      mainDB: 'taxonomy',
      mainAccession: `${taxid}`,
    },
  };
  return (
    <div>
      Species: <Link newTo={newTo}>{fullname}</Link>
    </div>
  );
};

Species.propTypes = {
  metadata: T.shape({
    source_organism: T.shape({
      fullname: T.string.isRequired,
      taxid: T.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Species;
