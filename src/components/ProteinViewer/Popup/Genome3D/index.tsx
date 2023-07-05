import React from 'react';
import Positions from '../Positions';

export type Genome3DDetail = {
  feature: {
    accession: string;
    type: string;
    source_database: string;
    confidence: string;
    protein: string;
    locations: ProtVistaLocation[];
  };
};
type Props = {
  detail: Genome3DDetail;
};

const Genome3DPopup = ({ detail }: Props) => {
  const {
    accession,
    source_database: db,
    type,
    locations,
    protein,
  } = detail.feature;

  return (
    <section>
      <h5>Genome3D [{type}]</h5>
      <h6>{db}</h6>

      <div>{accession}</div>
      {locations.map(({ fragments }, i) => (
        <Positions fragments={fragments} protein={protein} key={i} />
      ))}
    </section>
  );
};
export default Genome3DPopup;
