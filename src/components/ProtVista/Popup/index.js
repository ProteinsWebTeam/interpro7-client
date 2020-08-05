import React from 'react';
import T from 'prop-types';

import ProtVistaHydroPopup from './Hydro';
import ProtVistaResiduePopup from './Residue';
import ProtVistaEntryPopup from './Entry';
import ProtVistaConservationPopup from './Conservation';

const ProtVistaPopup = ({
  detail,
  sourceDatabase,
  data,
  protein,
  goToCustomLocation,
}) => {
  // comes from the conservation track
  if (detail.feature.type === 'sequence_conservation') {
    return <ProtVistaConservationPopup detail={detail} data={data} />;
  }

  // comes from a residue
  if ((detail?.target?.classList || '').contains('residue')) {
    return (
      <ProtVistaResiduePopup detail={detail} sourceDatabase={sourceDatabase} />
    );
  }

  // comes from the hydrophobicity track
  if (detail?.target.closest('protvista-coloured-sequence')) {
    return <ProtVistaHydroPopup detail={detail} />;
  }

  // comes from the Entry track
  return (
    <ProtVistaEntryPopup
      detail={detail}
      sourceDatabase={sourceDatabase}
      goToCustomLocation={goToCustomLocation}
      protein={protein}
    />
  );
};
ProtVistaPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    highlight: T.string,
    target: T.element,
  }),
  sourceDatabase: T.string,
  data: T.array,
  goToCustomLocation: T.func,
  protein: T.object,
};

export default ProtVistaPopup;
