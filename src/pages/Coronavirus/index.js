import React from 'react';

import Redirect from 'components/generic/Redirect';

const Coronavirus = () => {
  return (
    <Redirect
      to={{
        description: {
          main: { key: 'proteome' },
          proteome: { db: 'uniprot', accession: 'UP000464024' },
        },
      }}
    />
  );
};

export default Coronavirus;
