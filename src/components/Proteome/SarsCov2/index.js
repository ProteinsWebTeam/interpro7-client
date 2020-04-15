import React from 'react';
import T from 'prop-types';

import { SpeciesIcon } from 'pages/Taxonomy';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from 'pages/style.css';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from 'components/Table/views/Grid/style.css';

const f = foundationPartial(ebiGlobalStyles, pageStyle, fonts, local);

const SarsCov2 = ({
  metadata: {
    lineage,
    name: { name },
  },
}) => {
  // eslint-disable-next-line no-unused-vars
  const groupBy = (accessions) => {
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
                <h6>InterPro SARS-Cov-2 Update</h6>
              </div>
            </div>
            <div>
              <br />
              <p>
                This page collates the information within InterPro relating to
                the {name} protein sequences.
              </p>
              <ul>
                <li>
                  The &quot;Entries&quot; link above lists all InterPro entries
                  which match any of the SARS-Cov-2 proteins. Selecting the name
                  or IPR accession from that list will open the entry page with
                  more information, including any other sequences matched by
                  that entry.
                </li>
                <li>
                  The &quot;Proteins&quot; link above lists all SARS-Cov-2
                  proteins. Clicking on the accession in this list will open a
                  protein viewer, showing the location of all InterPro matches
                  to that protein.
                </li>
              </ul>
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
    name: T.shape({ name: T.string }),
  }),
};

export default SarsCov2;
