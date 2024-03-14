import React, { PropsWithChildren } from 'react';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import s from '../../style.css';

const css = cssBinder(s);

type Props = PropsWithChildren<{
  className?: string;
  value?: number | string;
  noLink?: boolean;
  attributeName?: string;
}>;

const toFunctionFor =
  (value: number | string, key: string = 'page') =>
  (customLocation: InterProLocation): InterProLocation => ({
    ...customLocation,
    search: { ...customLocation.search, [key]: String(value) },
  });

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const PaginationItem = ({
  className,
  attributeName = 'page',
  value,
  noLink,
  children,
}: Props) => {
  const LinkOrSpan = !value || noLink ? 'span' : Link;
  const props: {
    className?: string;
    to?: (customLocation: InterProLocation) => InterProLocation;
  } = {};
  if (value) {
    if (noLink) {
      props.className = css('no-link');
    } else {
      props.to = toFunctionFor(value, attributeName);
    }
  }
  return (
    <li className={className}>
      <LinkOrSpan {...props} onClick={() => !noLink && scrollToTop()}>
        {children || value}
      </LinkOrSpan>
    </li>
  );
};

export default PaginationItem;
