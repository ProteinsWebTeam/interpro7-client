import React from 'react';

import Link from 'components/generic/Link';

type Props = {
  taxID: string | number;
  fullName: string;
};

const Species = ({ taxID, fullName }: Props) => {
  return (
    <Link
      to={{
        description: {
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession: `${taxID}` },
        },
      }}
    >
      {fullName}
    </Link>
  );
};

export default Species;
