import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const StructureSubPage = ({ data } /*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
StructureSubPage.propTypes = {
  data: T.object.isRequired,
};

export default StructureSubPage;
