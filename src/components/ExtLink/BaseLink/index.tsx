import React from 'react';

import Link from 'components/generic/Link';

type BaseLinkProps = {
  id?: string | number;
  pattern?: string;
  href?: string;
  rel?: string;
  to?: Object;
  target?: string;
  className?: string;
  activeClass?: ActiveClassProp;
  children: React.ReactNode;
};

export const BaseLink = ({
  id,
  pattern,
  href,
  to,
  rel,
  className,
  children,
  activeClass,
  ...rest
}: BaseLinkProps) => {
  const props: Record<string, unknown> = {
    href: href || to || (pattern || '').replace('{id}', String(id)),
  };
  if (className) props.className = className;
  if (rel) {
    props.rel = rel.includes('noopener') ? rel : `${rel} noopener`;
    props.rel = rel.includes('noreferrer') ? rel : `${rel} noreferrer`;
  } else {
    props.rel = 'noopener noreferrer';
  }
  return (
    <Link {...rest} {...props}>
      {children}
    </Link>
  );
};

BaseLink.displayName = 'BaseLink';

export default BaseLink;
