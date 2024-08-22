import React from 'react';

export type ResidueDetail = {
  feature?: {
    locations: Array<ProtVistaLocation>;
    accession: string;
    currentResidue: {
      description?: string;
      residue?: string;
      residues?: string;
      start: number;
      end: number;
    };
  };
  highlight: string;
};
type Props = {
  detail: ResidueDetail;
  sourceDatabase: string;
};

const ProtVistaResiduePopup = ({ detail, sourceDatabase }: Props) => {
  if (!detail?.feature) return null;

  let accession = detail.feature.accession;

  if (sourceDatabase === 'PIRSF') {
    accession = accession.replace('PIRSF', 'PIRSR');
    accession = accession.replace(/\.\d+/, '');
  }

  const residueLocation: ProtVistaLocation = detail?.feature.locations[0];
  const residueDescription: string = residueLocation.description || '';

  return (
    <section>
      <h6>
        {sourceDatabase} -{' '}
        {accession.startsWith('residue:')
          ? accession.split('residue:')[1]
          : accession}
      </h6>
      {residueDescription && <p>{residueDescription}</p>}
      <div>
        // Display only the position of the currently highlighted residue
        Residue({detail.highlight.split(':')[0]})
      </div>
    </section>
  );
};

export default ProtVistaResiduePopup;
