import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const EntrySubPage = ({ data } /*: {data: Object} */) => (
  <div>
    <Related data={data} />
  </div>
);
EntrySubPage.propTypes = {
  data: T.object.isRequired,
};

export default EntrySubPage;
