import React from 'react';
import Positions from '../Positions';

export type RepeatsDBDetail = {
  feature: {
    accession: string;
    type: string;
    protein: string;
    locations: Array<
      ProtVistaLocation & {
        period: string;
        classification: string[];
      }
    >;
  };
};
type Props = {
  detail: RepeatsDBDetail;
};

const RepeatsDBPopup = ({ detail }: Props) => {
  const { locations, type, protein } = detail.feature;
  return (
    <section>
      <h5>RepeatsDB [{type}]</h5>

      {locations.map(({ fragments, period, classification }, i) => (
        <div key={i}>
          {period && (
            <div>
              <b>Period:</b> {period}
            </div>
          )}
          {classification.length && (
            <div>
              <b>Classification:</b> {classification.join(', ')}
            </div>
          )}
          <Positions fragments={fragments} protein={protein} key={i} />
        </div>
      ))}
    </section>
  );
};
export default RepeatsDBPopup;
