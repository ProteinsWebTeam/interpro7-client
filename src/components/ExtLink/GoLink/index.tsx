import React from 'react';

import BaseLink from '../BaseLink';

const GoLink = ({
  id,
  target,
  className,
  children,
  ...props
}: BaseLinkProps) => {
  const pattern = 'https://www.ebi.ac.uk/QuickGO/GTerm?id={id}';
  const formattedId = typeof id === 'string' ? id.replace('_', ':') : id;
  return (
    <BaseLink
      id={formattedId}
      target={target || '_blank'}
      pattern={pattern}
      {...(className ? { className } : {})}
      {...props}
    >
      {children || formattedId}
    </BaseLink>
  );
};
GoLink.displayName = 'GoLink';

export default GoLink;
