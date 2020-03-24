import React from 'react';
import T from 'prop-types';

import { SpeciesIcon } from 'pages/Taxonomy';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from 'pages/style.css';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from 'components/Table/views/Grid/style.css';
import EntryHierarchy from 'components/Proteome/EntryHierarchy';

const f = foundationPartial(ebiGlobalStyles, pageStyle, fonts, local);

const SarsCov2 = ({ metadata: { accession, lineage } }) => {
  // eslint-disable-next-line no-unused-vars
  const groupBy = accessions => {
    const n = 5;
    const groups = [];
    for (let i = 0; i < n; i++) groups.push([]);

    for (let i = 0; i < accessions.length; i++) {
      groups[i % n].push(accessions[i]);
    }
    return groups;
  };
  return (
    <section>
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <div className={f('grid-card')} style={{ maxWidth: '100%' }}>
            <div className={f('card-header')}>
              <div className={f('card-image')}>
                {lineage && <SpeciesIcon lineage={lineage} />}
              </div>
              <div className={f('card-title')}>
                <h6>InterPro SARS-CoV-2 Update</h6>
              </div>
            </div>
            <div>
              <EntryHierarchy accession={accession} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
SarsCov2.propTypes = {
  metadata: T.shape({
    accession: T.string,
    lineage: T.string,
  }),
};

export default SarsCov2;
