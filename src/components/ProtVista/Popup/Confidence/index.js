// @flow
import React from 'react';
import T from 'prop-types';

import ColorScale from '../ColorScale';

const levels = {
  H: 'Very high',
  M: 'Confident',
  L: 'Low',
  D: 'Very Low',
};
/*::
  import type {PopupDetail} from '../index.js';
*/
const ConfidencePopup = ({ detail } /*: {detail: PopupDetail} */) => {
  const element = detail?.target?.closest('protvista-coloured-sequence');
  if (!element) return null;
  const aa = detail.feature.aa || '';
  return (
    <section>
      <h6>Residue {detail.feature.start}</h6>
      <div>
        <b>{aa ? levels[aa] : '-'}</b>
        <br />
        <br />
        <ColorScale {...(element /*: any */).colorScale} />
        <br />
      </div>
    </section>
  );
};
ConfidencePopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    target: T.any,
  }),
};

export default ConfidencePopup;