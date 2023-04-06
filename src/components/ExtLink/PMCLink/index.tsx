import React from 'react';

import BaseLink from '../BaseLink';

const PMCLink = ({ id, target, children, ...props }: BaseLinkProps) => (
  <BaseLink
    id={`${id}`}
    target={target || '_blank'}
    pattern="https://europepmc.org/abstract/MED/{id}"
    {...props}
  >
    {children || `PUB${id}`}
  </BaseLink>
);
PMCLink.displayName = 'PMCLink';

export default PMCLink;
