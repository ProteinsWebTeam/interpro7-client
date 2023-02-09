// @flow
import React from 'react';
import T from 'prop-types';

import ColorScale from '../ColorScale';
/*::
  import type {PopupDetail} from '../index.js';
*/
const HydroPopup = ({ detail } /*: {detail: PopupDetail} */) => {
  const element = detail?.target?.closest('protvista-colored-sequence');
  if (!element) return null;
  return (
    <section>
      <h6>
        Residue {detail.feature.start}: {detail.feature.aa}
      </h6>
      <div>
        <b>Hydrophobicity:</b> {detail.feature.value}
        <br />
        <br />
        <ColorScale {...(element /*: any */).colorScale} />
        <br />
      </div>
    </section>
  );
};
HydroPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    target: T.any,
  }),
};

export default HydroPopup;
