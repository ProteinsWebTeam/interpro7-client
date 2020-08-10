import React from 'react';
import T from 'prop-types';

import ColorScale from '../ColorScale';

const HydroPopup = ({ detail }) => {
  const element = detail?.target.closest('protvista-coloured-sequence');
  if (!element) return null;
  return (
    <section>
      <h6>
        Residue {detail.feature.start}: {detail.feature.aa}
      </h6>
      <div>
        <b>Hydrophobicity:</b> {detail.feature.value}
        <br />
        <b>Scale:</b> <ColorScale {...element.colorScale} />
        <br />
      </div>
    </section>
  );
};
HydroPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    target: T.element,
  }),
};

export default HydroPopup;
