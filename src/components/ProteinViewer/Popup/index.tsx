import React from 'react';

import ProtVistaConfidencePopup, { ConfidenceDetail } from './Confidence';
import ProtVistaResiduePopup, { ResidueDetail } from './Residue';
import ProtVistaVariationPopup, { VariationDetail } from './Variation';
import ProtVistaEntryPopup, { EntryDetail } from './Entry';
import ProtVistaConservationPopup, { ConservationDetail } from './Conservation';
import RepeatsDBPopup, { RepeatsDBDetail } from './RepeatsDB';
import ProtVistaPTMPopup, { PTMDetail } from './PTM';
import DisProtPopup, { DisProtDetail } from './DisProt';
import { ExtendedFeature } from '..';

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
  sequence?: string;
  sourceDatabase: string;
  currentLocation: InterProLocation;
  detail: PopupDetail;
};

const ProtVistaPopup = ({
  sequence,
  detail,
  sourceDatabase,
  currentLocation,
}: Props) => {
  // comes from PTMTrack
  if ((detail as PTMDetail)?.feature?.type == 'ptm') {
    return (
      <ProtVistaPTMPopup
        sequence={sequence || ''}
        detail={detail as PTMDetail}
      />
    );
  }

  // comes from the conservation track
  if (detail.type === 'conservation') {
    return <ProtVistaConservationPopup detail={detail as ConservationDetail} />;
  }

  // comes from a residue
  if (
    (detail.feature as ExtendedFeature).type === 'residue' ||
    (detail.feature as ExtendedFeature).residues !== undefined
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
