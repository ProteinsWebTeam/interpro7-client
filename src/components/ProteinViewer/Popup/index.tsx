import React from 'react';

import { goToCustomLocation } from 'actions/creators';

import ProtVistaConfidencePopup, { ConfidenceDetail } from './Confidence';
import ProtVistaResiduePopup, { ResidueDetail } from './Residue';
import ProtVistaEntryPopup, { EntryDetail } from './Entry';
import ProtVistaConservationPopup, { ConservationDetail } from './Conservation';
import Genome3DPopup, { Genome3DDetail } from './Genome3D';
import RepeatsDBPopup, { RepeatsDBDetail } from './RepeatsDB';

export type PopupDetail = (
  | ConservationDetail
  | ResidueDetail
  | ConfidenceDetail
  | EntryDetail
) & {
  target?: HTMLElement;
  type?: string;
};
type Props = {
  sourceDatabase: string;
  goToCustomLocation: typeof goToCustomLocation;
  currentLocation: InterProLocation;
  detail: PopupDetail;
};

const ProtVistaPopup = ({
  detail,
  sourceDatabase,
  currentLocation,
  goToCustomLocation,
}: Props) => {
  // comes from the conservation track
  if (detail.type === 'conservation') {
    return <ProtVistaConservationPopup detail={detail as ConservationDetail} />;
  }

  // comes from a residue
  if (
    (detail?.target?.classList &&
      detail.target.classList.contains('residue')) ||
    sourceDatabase === 'PIRSR'
  ) {
    return (
      <ProtVistaResiduePopup
        detail={detail as ResidueDetail}
        sourceDatabase={sourceDatabase}
      />
    );
  }

  const colouredTrack = detail?.target?.closest('nightingale-colored-sequence');
  // comes from the alphafold confidence track
  if (colouredTrack) {
    if (colouredTrack.classList.contains('confidence'))
      return <ProtVistaConfidencePopup detail={detail as ConfidenceDetail} />;
  }
  if (((detail as Genome3DDetail)?.feature?.accession || '').startsWith('G3D:'))
    return <Genome3DPopup detail={detail as Genome3DDetail} />;

  if (
    ((detail as RepeatsDBDetail)?.feature?.accession || '').startsWith(
      'REPEAT:'
    )
  )
    return <RepeatsDBPopup detail={detail as RepeatsDBDetail} />;

  // comes from the Entry track
  return (
    <ProtVistaEntryPopup
      detail={detail as EntryDetail}
      sourceDatabase={sourceDatabase}
      goToCustomLocation={goToCustomLocation}
      currentLocation={currentLocation}
    />
  );
};

export default ProtVistaPopup;
