/* @flow */
import React, {PropTypes as T} from 'react';

import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';

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
  <div>
    {metadata.integrated &&
      <Integration intr={metadata.integrated} pathname={pathname} />
    }
    {
      metadata.member_databases &&
      <ContributingSignatures
        contr={metadata.member_databases}
        pathname={pathname}
      />
    }
    {
      Object.keys(metadata.go_terms) &&
      <div><GoTerms terms={metadata.go_terms} /></div>
    }
    <div><Description textBlocks={metadata.description} /></div>
    {
      Object.keys(metadata.literature).length &&
      <div><Literature references={metadata.literature} /></div>
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
