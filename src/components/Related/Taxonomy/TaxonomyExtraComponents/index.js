// @flow
import React, { useState } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import KeySpeciesTable from 'components/Taxonomy/KeySpeciesTable';
import Sunburst from 'components/Related/Taxonomy/Sunburst';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const TaxonomyExtraComponents = (
  {
    focusType,
    showKeySpecies,
    showSunburst,
  } /*: {focusType: string, showKeySpecies: boolean, showSunburst: boolean} */,
) => {
  const [showTaxoInfo, setShowTaxoInfo] = useState(true);
  if (focusType !== 'taxonomy') return null;
  return (
    <>
      {showSunburst && <Sunburst />}
      {showTaxoInfo && (
        <div className={f('callout', 'info', 'withicon')} data-closable>
          <button
            className={f('close-button')}
            aria-label="Close alert"
            type="button"
            data-close
            onClick={() => setShowTaxoInfo(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h5>
            The taxonomy information is available for both Key species and all
            organisms. The below tables are shown based on the preference in
            InterPro settings. If you wish to change it, please do in the{' '}
            <Link to={{ description: { other: ['settings'] } }}>Settings</Link>{' '}
            page
          </h5>
        </div>
      )}
      {showKeySpecies && <KeySpeciesTable />}
    </>
  );
};

TaxonomyExtraComponents.propTypes = {
  focusType: T.string,
  showKeySpecies: T.bool,
  showSunburst: T.bool,
};

export default TaxonomyExtraComponents;
