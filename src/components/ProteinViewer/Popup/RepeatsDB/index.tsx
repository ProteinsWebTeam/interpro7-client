import React from 'react';

export type RepeatsDBDetail = {
  feature: {
    accession: string;
    type: string;
    locations: ProtVistaLocation[];
  };
};
type Props = {
  detail: RepeatsDBDetail;
};

const RepeatsDBPopup = ({ detail }: Props) => {
  const { locations, type } = detail.feature;
  const period = locations[0]?.period as string;
  const classification = (locations[0]?.classification || []) as string[];
  return (
    <section>
      <h5>RepeatsDB [{type}]</h5>

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
    </section>
  );
};
export default RepeatsDBPopup;
