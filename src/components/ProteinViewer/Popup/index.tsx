import React from 'react';

import ProtVistaConfidencePopup, { ConfidenceDetail } from './Confidence';
import ProtVistaResiduePopup, { ResidueDetail } from './Residue';
import ProtVistaVariationPopup, { VariationDetail } from './Variation';
import ProtVistaEntryPopup, { EntryDetail } from './Entry';
import ProtVistaConservationPopup, { ConservationDetail } from './Conservation';
import Genome3DPopup, { Genome3DDetail } from './Genome3D';
import RepeatsDBPopup, { RepeatsDBDetail } from './RepeatsDB';
import DisProtPopup, { DisProtDetail } from './DisProt';
import ProtVistaPTMPopup, { PTMDetail } from './PTM';

export type PopupDetail = (
  | ConservationDetail
  | ResidueDetail
  | ConfidenceDetail
  | PTMDetail
  | EntryDetail
) & {
  target?: HTMLElement;
  type?: string;
};
type Props = {
  sourceDatabase: string;
  currentLocation: InterProLocation;
  detail: PopupDetail;
};

const ProtVistaPopup = ({ detail, sourceDatabase, currentLocation }: Props) => {
  // comes from PTMTrack
  if ((detail as PTMDetail)?.feature?.type == 'ptm') {
    return <ProtVistaPTMPopup detail={detail as PTMDetail} />;
  }

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
  const variationTrack = detail?.target?.closest('nightingale-variation');
  // comes from the alphafold confidence track
  if (variationTrack) {
    return <ProtVistaVariationPopup detail={detail as VariationDetail} />;
  }
  if (((detail as Genome3DDetail)?.feature?.accession || '').startsWith('G3D:'))
    return <Genome3DPopup detail={detail as Genome3DDetail} />;

  if (
    ((detail as RepeatsDBDetail)?.feature?.accession || '').startsWith(
      'REPEAT:',
    )
  )
    return <RepeatsDBPopup detail={detail as RepeatsDBDetail} />;
  if (
    ((detail as RepeatsDBDetail)?.feature?.accession || '').startsWith(
      'DISPROT:',
    )
  )
    return <DisProtPopup detail={detail as DisProtDetail} />;

  // comes from the Entry track
  return (
    <ProtVistaEntryPopup
      detail={detail as EntryDetail}
      sourceDatabase={sourceDatabase}
      currentLocation={currentLocation}
    />
  );
};

export default ProtVistaPopup;
