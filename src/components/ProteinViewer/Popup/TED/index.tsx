import React from 'react';
import Positions from '../Positions';

export type TEDDetails = {
  feature: {
    accession: string;
    type: string;
    protein: string;
    locations: Array<ProtVistaLocation>;
  };
};
type Props = {
  detail: TEDDetails;
};

const TEDPopup = ({ detail }: Props) => {
  const { accession, locations, protein } = detail.feature;
  return (
    <section>
      <h6>
        TED Consensus Domains: {accession.replace('TED:', '').split('-')[0]}
      </h6>
      {locations.map(({ fragments }, i) => (
        <div key={i}>
          <Positions fragments={fragments} protein={protein} key={i} />
        </div>
      ))}
    </section>
  );
};
export default TEDPopup;
