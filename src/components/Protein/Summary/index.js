/* @flow */
import React, {PropTypes as T} from 'react';

import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Sequence from 'components/Protein/Sequence';

const SummaryProtein = (
  {data: {metadata}}
  /*: {data: {metadata: Object}} */
) => (
  <div>
    {
      Object.keys(metadata.go_terms).length &&
      <div><GoTerms terms={metadata.go_terms} /></div>
    }
    {
      metadata.description && metadata.description.length &&
      <Description textBlocks={metadata.description}/>
    }
    <div><Sequence>{metadata.sequence}</Sequence></div>
  </div>
);
SummaryProtein.propTypes = {
  data: T.shape({
    metadata: T.object.isRequired,
  }).isRequired,
};

export default SummaryProtein;
