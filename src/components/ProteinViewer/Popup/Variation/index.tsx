import { VariationDatum } from '@nightingale-elements/nightingale-variation/dist/nightingale-variation';
import React from 'react';

export type VariationDetail = {
  feature?: VariationDatum;
};
type Props = {
  detail: VariationDetail;
};

const ProtVistaVariationPopup = ({ detail }: Props) => {
  if (!detail?.feature) return null;
  const { accession, wildType, variant, start, size, consequenceType } =
    detail.feature;

  const hasMultiple = size !== undefined && (size || 0) > 1;
  return (
    <section>
      <h6>{accession}</h6>
      <p>
        {wildType}&gt;{variant} - {consequenceType}
      </p>
      <div>
        Position{hasMultiple && 's'}: {start}
        {hasMultiple && `-${start + (size || 0)}`}
      </div>
    </section>
  );
};

export default ProtVistaVariationPopup;
