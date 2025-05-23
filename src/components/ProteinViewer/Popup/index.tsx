import React from 'react';

import ProtVistaConfidencePopup, { ConfidenceDetail } from './Confidence';
import ProtVistaResiduePopup, { ResidueDetail } from './Residue';
import ProtVistaVariationPopup, { VariationDetail } from './Variation';
import ProtVistaEntryPopup, { EntryDetail } from './Entry';
import ProtVistaConservationPopup, { ConservationDetail } from './Conservation';
import RepeatsDBPopup, { RepeatsDBDetail } from './RepeatsDB';
import ProtVistaPTMPopup, { PTMDetail } from './PTM';
import DisProtPopup, { DisProtDetail } from './DisProt';
import TEDPopup, { TEDDetails } from './TED';
import { ExtendedFeature } from '../utils';

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
  currentLocation: InterProLocation;
  detail: PopupDetail;
};

const ProtVistaPopup = ({ detail, sourceDatabase, currentLocation }: Props) => {
  // Use :nMatch to distiguish the tracks during rendering on PV, but don't show the suffix on labels and tooltips
  const accession = (detail.feature as ExtendedFeature).accession;

  if (accession) {
    (detail.feature as ExtendedFeature).accession = accession;
  }

  // comes from PTMTrack
  if (
    (detail as PTMDetail)?.feature?.type == 'ptm' &&
    !(detail as PTMDetail).feature?.accession?.startsWith('IPR')
  ) {
    return <ProtVistaPTMPopup detail={detail as PTMDetail} />;
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
    ((detail as DisProtDetail)?.feature?.accession || '').startsWith('DISPROT:')
  )
    return <DisProtPopup detail={detail as DisProtDetail} />;
  if (((detail as TEDDetails)?.feature?.accession || '').startsWith('TED:'))
    return <TEDPopup detail={detail as TEDDetails} />;

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
