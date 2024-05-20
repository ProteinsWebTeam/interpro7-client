import React, { PropsWithChildren } from 'react';

import Link from 'components/generic/Link';

const Example = ({ children }: PropsWithChildren) => {
  return (
    <i>
      {' '}
      <Link
        to={{
          description: {
            main: { key: 'search' },
            search: { type: 'text', value: children },
          },
        }}
      >
        {children}
      </Link>
    </i>
  );
};

export default Example;
