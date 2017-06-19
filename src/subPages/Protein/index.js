// @flow
import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const ProteinSub = ({data}/*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
ProteinSub.propTypes = {
  data: T.object.isRequired,
};

export default ProteinSub;
