import React from 'react';

export type Genome3DDetail = {
  feature: {
    accession: string;
    type: string;
    source_database: string;
    confidence: string;
  };
};
type Props = {
  detail: Genome3DDetail;
};

const Genome3DPopup = ({ detail }: Props) => {
  const { accession, source_database: db, type } = detail.feature;

  return (
    <section>
      <h5>Genome3D [{type}]</h5>
      <h6>{db}</h6>

      <div>{accession}</div>
    </section>
  );
};
export default Genome3DPopup;
