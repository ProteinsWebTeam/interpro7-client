import React from 'react';
import Positions from '../Positions';

export type DisProtDetail = {
  feature: {
    accession: string;
    type: string;
    protein: string;
    locations: Array<
      ProtVistaLocation & {
        term_name: string;
        ec_name: string;
        released: string;
      }
    >;
  };
};
type Props = {
  detail: DisProtDetail;
};

const DisProtPopup = ({ detail }: Props) => {
  const { locations, type, protein } = detail.feature;
  return (
    <section>
      <h5>DisProt [{type}]</h5>

      {locations.map(({ fragments, term_name, ec_name, released }, i) => (
        <div key={i}>
          {term_name && (
            <div>
              {term_name} - ({released})
            </div>
          )}
          {ec_name && <div>{ec_name}</div>}
          <Positions fragments={fragments} protein={protein} key={i} />
        </div>
      ))}
    </section>
  );
};
export default DisProtPopup;
