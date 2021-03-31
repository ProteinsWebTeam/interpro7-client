// @flow
import React from 'react';
import T from 'prop-types';

/*::
  import type {PopupDetail} from '../index.js';

  type Props = {
    detail: PopupDetail,
  }
*/

const ProtVistaConservationPopup = ({ detail } /*: Props */) => {
  const match = detail.feature;
  const sourceDatabase = 'PANTHER'; // TODO: get it from match.accession;
  const accession = Object.keys(match)[0];

  return (
    <section>
      <h6>{accession}</h6>

      <div>
        <div>{sourceDatabase}</div>

        {match[accession]?.value && (
          <>
            <p>Position : {match[accession].position}</p>
            <p>Conservation : {match[accession].value}</p>
          </>
        )}
      </div>
    </section>
  );
};
ProtVistaConservationPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
  }),
};
export default ProtVistaConservationPopup;
