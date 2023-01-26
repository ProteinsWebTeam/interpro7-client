import React from 'react';
import T from 'prop-types';

/*::
  import type {PopupDetail} from '../index.js';
  type Props = {
    detail: PopupDetail,
    sourceDatabase: string,
  }
*/

const ProtVistaResiduePopup = ({ detail, sourceDatabase } /*: Props */) => {
  let { accession, currentResidue } = detail?.feature;

  if (sourceDatabase === 'PIRSF') {
    accession = accession.replace('PIRSF', 'PIRSR');
  }
  if (sourceDatabase === 'PIRSR') {
    accession = accession.replace(/\.\d+/, '');

    currentResidue = detail?.feature.locations[0].fragments[0];
    currentResidue.description = detail?.feature.locations[0].description;
  }
  const start = currentResidue?.start;
  const end = currentResidue?.end;
  const description = currentResidue?.description || '';
  const residue = currentResidue?.residue || currentResidue?.residues || '';
  const hasMultiple = end && end !== start;
  return (
    <section>
      <h6>
        {sourceDatabase} -{' '}
        {accession.startsWith('residue:')
          ? accession.split('residue:')[1]
          : accession}
      </h6>
      {description && <p>[{description}]</p>}
      <div>
        Residue{hasMultiple && 's'}: {start}
        {hasMultiple && `-${end}`} ({residue})
      </div>
    </section>
  );
};
ProtVistaResiduePopup.propTypes = {
  detail: T.shape({
    feature: T.object,
  }),
  sourceDatabase: T.string,
};
export default ProtVistaResiduePopup;
