import React from 'react';
import Positions from '../Positions';

export type DisProtDetail = {
  feature: {
    accession: string;
    type: string;
    protein: string;
    locations: Array<ProtVistaLocation>;
  };
};
type Props = {
  detail: DisProtDetail;
};

const DisProtPopup = ({ detail }: Props) => {
  const { locations, protein } = detail.feature;
  return (
    <section>
      <h6>DisProt: {locations[0].description}</h6>

      {locations.map(({ fragments }, i) => (
        <div key={i}>
          <Positions fragments={fragments} protein={protein} key={i} />
        </div>
      ))}
    </section>
  );
};
export default DisProtPopup;
