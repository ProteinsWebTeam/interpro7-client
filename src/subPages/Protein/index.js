// @flow
import React, {PropTypes as T} from 'react';

import Related from 'components/Related';

const ProteinSub = (
  {data, location: {pathname}, main}
  /*: {data: Object, location: {pathname: string}, main: string} */
) => (
  <div>
    <Related
      data={data}
      main={main}
      secondary="protein"
      pathname={pathname}
    />
  </div>
);
ProteinSub.propTypes = {
  data: T.object.isRequired,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
  main: T.string.isRequired,
};

export default ProteinSub;
