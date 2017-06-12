import React from 'react';
import T from 'prop-types';

import Related from 'components/Related';

const StructureSub = (
  {data, location: {pathname}, main}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <Related
      data={data}
      main={main}
      secondary="structure"
      pathname={pathname}
    />
  </div>
);
StructureSub.propTypes = {
  data: T.object.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  main: T.string.isRequired,
};

export default StructureSub;
