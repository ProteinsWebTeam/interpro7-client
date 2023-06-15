import React from 'react';

export type ConservationDetail = {
  feature: {
    [p: string]: {
      position: number;
      value?: number;
    };
  };
};
type Props = {
  detail: ConservationDetail;
};

const ProtVistaConservationPopup = ({ detail }: Props) => {
  const match = detail.feature;
  const sourceDatabase = 'PANTHER'; // TODO: get it from match.accession;
  const accession = Object.keys(match)[0];

  return (
    <section>
      <h6>{accession}</h6>

      <div>
        <div>{sourceDatabase}</div>

        {match[accession]?.value && (
          <>
            <p>Position : {match[accession].position}</p>
            <p>Conservation : {match[accession].value}</p>
          </>
        )}
      </div>
    </section>
  );
};
export default ProtVistaConservationPopup;
