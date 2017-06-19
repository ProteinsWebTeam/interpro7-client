import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const EntrySub = ({data}/*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
EntrySub.propTypes = {
  data: T.object.isRequired,
};

export default EntrySub;
