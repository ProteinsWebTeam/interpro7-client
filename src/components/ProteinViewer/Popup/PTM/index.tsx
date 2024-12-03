import React from 'react';
import type { PTMFragment } from 'src/components/ProteinViewer';

export type PTMDetail = {
  target?: HTMLElement;
  highlight: string;
  feature?: {
    name?: string;
    accession?: string;
    type?: string;
    sources?: string;
    locations: {
      accession: string;
      description: string;
      fragments: PTMFragment[];
    }[];
  };
};
type Props = {
  sequence: string;
  detail: PTMDetail;
};

const ProtVistaPTMPopup = ({ sequence, detail }: Props) => {
  const highlightedPosition = parseInt(detail.highlight.split(':')[0]);
  const feature = detail.feature;

  if (feature?.accession?.startsWith('IPR')) {
    const startPos = feature?.locations[0]['fragments'][0]['start'] - 1;
    const endPos = feature?.locations[0]['fragments'][0]['end'];

    return (
      <section>
        <div>
          <span> Peptide: </span>
          <div>{sequence.slice(startPos, endPos)}</div>
        </div>
      </section>
    );
  } else {
    const ptmData: PTMFragment | undefined =
      detail.feature?.locations[0].fragments.filter(
        (f) => f.start == highlightedPosition,
      )[0];

    if (ptmData) {
      const ptmPeptide: string = ptmData.peptide as string;
      const ptmPos: number = ptmData.relative_pos as number;
      const peptideStart: number = ptmData.peptide_start as number;

      return (
        <section>
          <div>
            <span> Peptide: </span>

            {/* Show peptide sequence and highlight PTM */}
            <span>{ptmPeptide.slice(0, ptmPos)}</span>
            <span>
              <b>{ptmPeptide[ptmPos]}</b>
            </span>
            <span>{ptmPeptide.slice(ptmPos + 1)}</span>

            {/* Show peptide sequence and highlight PTM */}
            <span>
              &nbsp;({peptideStart} - {ptmData.peptide_end as string}){' '}
            </span>
          </div>
          <div>
            {ptmData.ptm_type as string} on {ptmPeptide[ptmPos]} (
            {peptideStart + ptmPos})
          </div>
          <div>Source: {ptmData.source as string[]}</div>
        </section>
      );
    }
  }

  return <></>;
};

export default ProtVistaPTMPopup;
