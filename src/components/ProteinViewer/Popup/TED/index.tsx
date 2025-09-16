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
      <h6>TED consensus domain</h6>
      <strong>Boundaries:</strong>{' '}
      {locations
        .map(({ fragments }) =>
          fragments
            .map((fragment) => `${fragment.start}-${fragment.end}`)
            .join(', '),
        )
        .join('; ')}
      <br />
      <strong>QScore:</strong>{' '}
      {locations.length > 0 ? (locations[0].score as string) : 'N/A'}
    </section>
  );
};
export default TEDPopup;
