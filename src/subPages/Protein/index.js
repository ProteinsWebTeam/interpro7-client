// @flow
import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const ProteinSubPage = ({ data } /*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
ProteinSubPage.propTypes = {
  data: T.object.isRequired,
};

export default ProteinSubPage;
