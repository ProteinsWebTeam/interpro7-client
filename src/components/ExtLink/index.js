/* eslint no-magic-numbers: [1, {ignore: [3]}] */
import React from 'react';
import T from 'prop-types';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';

import BaseLink from './BaseLink';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const types = {
  id: T.oneOfType([T.string, T.number]).isRequired,
  children: T.node,
  className: T.string,
  target: T.string,
};

export const ProteomeLink = (
  {
    id,
    target,
    children,
    ...props
  } /*: {id: string, target?: string, children: any} */,
) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="http://www.uniprot.org/proteomes/{id}"
    {...props}
  >
    {children || `ProteomeID ${id}`}
  </BaseLink>
);
ProteomeLink.propTypes = {
  ...types,
  id: T.string.isRequired,
};
ProteomeLink.displayName = 'ProteomeLink';

const ExtLink = (
  {
    id,
    children,
    ...props
  } /*: {id: string | number, target?: string, children: any} */,
) => {
  switch (true) {
    case id.startsWith('PUB'):
      return (
        <Link id={id.slice(3)} {...props}>
          {children}
        </Link>
      );
    default:
      throw Error('Not a supported reference link');
  }
};
ExtLink.propTypes = types;
ExtLink.displayName = 'ExtLink';

export const FTPLink = (
  { href, children } /*: { href: string, children: any } */,
) => (
  <Tooltip
    title={
      'FTP support has been reduced in some browsers. You might need a FTP client in order to use this link.'
    }
  >
    <Link
      href={href}
      target="_blank"
      className={f('tag', 'secondary', 'ftp-link')}
    >
      <span className={f('icon', 'icon-common')} data-icon="&#xf233;" />{' '}
      {children}
    </Link>
  </Tooltip>
);
FTPLink.propTypes = {
  href: T.string,
  children: T.any,
};

export default ExtLink;
