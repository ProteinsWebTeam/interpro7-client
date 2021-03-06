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
  const { accession, type } = detail?.feature || {};
  let { currentResidue } = detail?.feature;

  // PIRSR is not integrated as entry in InterPro
  if (sourceDatabase === 'PIRSR') {
    currentResidue = detail?.feature.locations[0].fragments[0];
    currentResidue.description = detail?.feature.locations[0].description;
  }
  const start = currentResidue?.start;
  const description = currentResidue?.description || '';
  const residue = currentResidue?.residue || currentResidue?.residues || '';
  return (
    <section>
      <h6>
        {accession.startsWith('residue:')
          ? accession.split('residue:')[1]
          : accession}
        {description && <p>[{description}]</p>}
      </h6>

      <div>
        <div>
          Residue in {sourceDatabase}{' '}
          {type && type !== 'residue' && type.replace('_', ' ')}
        </div>
        <ul>
          <li>Position: {start}</li>
          <li>Residue: {residue}</li>
        </ul>
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
