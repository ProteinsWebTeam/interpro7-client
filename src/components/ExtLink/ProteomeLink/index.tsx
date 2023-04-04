import React from 'react';

import BaseLink from '../BaseLink';

const ProteomeLink = ({ id, target, children, ...props }: BaseLinkProps) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="http://www.uniprot.org/proteomes/{id}"
    {...props}
  >
    {children || `ProteomeID ${id}`}
  </BaseLink>
);
ProteomeLink.displayName = 'ProteomeLink';

export default ProteomeLink;
