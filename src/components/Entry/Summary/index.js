/* @flow */
import React, {PropTypes as T} from 'react';

import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import Title from 'components/Title';

import f from 'styles/foundation';

const SummaryEntry = (
  {data: {metadata}, location: {pathname}}
  /*: {
    data: {
      metadata: {
        integrated: string,
        member_databases?: Object,
        go_terms: Object,
        description: Array<string>,
        literature: Object,
      }
    },
    location: {pathname: string},
  } */
) => (
  <div className={f('sections')}>
    <section>
      <div className={f('row')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <Title metadata={metadata} pathname={pathname}/>
          <Description
            textBlocks={metadata.description}
            literature={metadata.literature}
          />
        </div>
        <div className={f('medium-4', 'large-4', 'columns')}>
          {
            metadata.integrated &&
            <div className={f('panel')}>
              <Integration intr={metadata.integrated} pathname={pathname} />
            </div>
          }
          {
            metadata.member_databases &&
            Object.keys(metadata.member_databases).length > 0 &&
            <div className={f('panel')}>
              <ContributingSignatures
                contr={metadata.member_databases}
                pathname={pathname}
              />
            </div>
          }
        </div>
      </div>
    </section>
    {
      Object.keys(metadata.literature).length &&
      <section id="references">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}><h4>References</h4></div>
        </div>
        <Literature references={metadata.literature} />
      </section>
    }
    {
      Object.keys(metadata.go_terms) &&
      <GoTerms terms={metadata.go_terms} />
  }
  </div>
);
SummaryEntry.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }),
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default SummaryEntry;
