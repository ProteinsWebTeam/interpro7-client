import React from 'react';

type PTMEvidence = {
  code: string;
  source: {
    name: string;
  };
  PEP: string;
  url: string;
};

type PTMFragment = {
  evidences: PTMEvidence[];
  ptm: string;
  peptide: string;
  ptm_type: string;
  source: string;
  start: number;
  position: number;
};

export type PTMDetail = {
  target?: HTMLElement;
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
  detail: PTMDetail;
};

const ProtVistaPTMPopup = ({ detail }: Props) => {
  const ptmData: PTMFragment | undefined =
    detail.feature?.locations[0].fragments[0];
  console.log(detail);
  if (ptmData) {
    return (
      <section>
        {detail.feature?.name}
        <div>
          <span> Peptide: </span>
          <span>{ptmData.peptide.slice(0, ptmData.position - 1)}</span>
          <span>
            <b>[{ptmData.peptide[ptmData.position - 1]}]</b>
          </span>
          <span>{ptmData.peptide.slice(ptmData.position)}</span>
          <span>&nbsp;(starts at {ptmData.start - ptmData.position + 1})</span>
        </div>
        <div>
          {ptmData.ptm_type} on {ptmData.peptide[ptmData.position - 1]} (
          {ptmData.position})
        </div>
        <div>Source: {ptmData.source}</div>
      </section>
    );
  }

  return <></>;
};

export default ProtVistaPTMPopup;
