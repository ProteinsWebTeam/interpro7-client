import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const StructureSub = ({data}/*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
StructureSub.propTypes = {
  data: T.object.isRequired,
};

export default StructureSub;
