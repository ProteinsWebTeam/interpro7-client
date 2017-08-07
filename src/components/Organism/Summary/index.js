// @flow
import React from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import Accession from 'components/Protein/Accession';
import Lineage from 'components/Organism/Lineage';
import Children from 'components/Organism/Children';
import { TaxLink } from 'components/ExtLink';
import f from 'styles/foundation';

const SummaryOrganism = (
  { data: { metadata } } /*: {data: {metadata: Object}} */,
) => {
  const _metadata = { ...metadata };
  _metadata.name = {
    name: metadata.full_name,
    short: metadata.scientific_name,
  };
  return (
    <div className={f('sections')}>
      <section>
        <div className={f('row')}>
          <div className={f('medium-8', 'large-8', 'columns')}>
            <Title metadata={_metadata} mainType={'organism'} />
            <Accession metadata={_metadata} />
            {_metadata.rank &&
              <div>
                Rank: {_metadata.rank}
              </div>}
            <Lineage lineage={_metadata.lineage} />
            <Children children={_metadata.children} />
          </div>
          <div className={f('medium-4', 'large-4', 'columns')}>
            <div className={f('panel')}>
              <h5>External Links</h5>
              <ul className={f('chevron')}>
                <li>
                  <TaxLink id={metadata.accession}>ENA Link</TaxLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
SummaryOrganism.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }).isRequired,
};

export default SummaryOrganism;
