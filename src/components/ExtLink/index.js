/* eslint no-magic-numbers: [1, {ignore: [3]}] */
import React from 'react';
import T from 'prop-types';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
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

export const BaseLink = (
  {
    id,
    pattern,
    href,
    to,
    rel,
    className,
    children,
    activeClass,
    ...rest
  } /*: {
  id?: string | number,
  pattern?: string,
  href?: string,
  rel?: string,
  to?: Object,
  target?: string,
  className?: string,
  activeClass?: string | function,
  children: any
} */,
) => {
  const props = {
    href: href || to || (pattern || '').replace('{id}', id),
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
BaseLink.propTypes = {
  id: T.oneOfType([T.string, T.number]),
  pattern: T.string,
  href: T.string,
  rel: T.string,
  to: T.object,
  target: T.string,
  className: T.string,
  activeClass: T.oneOfType([T.string, T.func]),
  children: T.node.isRequired,
};
BaseLink.displayName = 'BaseLink';

const patternLinkWrapper = (pattern) => {
  const Wrapped = (
    {
      id,
      target,
      children,
      ...props
    } /*: {id: string | number, target?: string, children?: any} */,
  ) => (
    <BaseLink id={id} target={target || '_blank'} pattern={pattern} {...props}>
      {children || id}
    </BaseLink>
  );
  Wrapped.propTypes = types;
  return Wrapped;
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

export const PMCLink = (
  {
    id,
    target,
    children,
    ...props
  } /*: {id: string | number, target?: string, children?: any} */,
) => (
  <BaseLink
    id={`${id}`}
    target={target || '_blank'}
    pattern="https://europepmc.org/abstract/MED/{id}"
    {...props}
  >
    {children || `PUB${id}`}
  </BaseLink>
);
PMCLink.propTypes = {
  ...types,
  id: T.oneOfType([T.string, T.number]).isRequired,
};
PMCLink.displayName = 'PMCLink';

export const DOILink = patternLinkWrapper('{id}');
DOILink.displayName = 'DOILink';

export const GoLink = (
  {
    id,
    target,
    className,
    children,
    ...props
  } /*: {id: string | number, target?: string, className?: string, children?: any} */,
) => {
  const pattern = 'https://www.ebi.ac.uk/QuickGO/GTerm?id={id}';
  return (
    <BaseLink
      id={id.replace('_', ':')}
      target={target || '_blank'}
      pattern={pattern}
      {...(className ? { className } : {})}
      {...props}
    >
      {children || id.replace('_', ':')}
    </BaseLink>
  );
};
GoLink.propTypes = types;
GoLink.displayName = 'GoLink';

export const PDBeLink = patternLinkWrapper(
  'https://www.ebi.ac.uk/pdbe/entry/pdb/{id}',
);
PDBeLink.displayName = 'PDBeLink';

export const PDBe3DLink = patternLinkWrapper(
  'https://www.ebi.ac.uk/pdbe/entry/view3D/{id}/' +
    '?view=entry_index&viewer=jmol&controls=codename_hero',
);
PDBe3DLink.displayName = 'PDBe3DLink';

export const UniProtLink = patternLinkWrapper(
  'http://www.uniprot.org/uniprot/{id}',
);
UniProtLink.displayName = 'UniProtLink';

export const Genome3dLink = patternLinkWrapper(
  'http://www.genome3d.net/uniprot/id/{id}/annotations',
);
Genome3dLink.displayName = 'Genome3DLink';

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
        <PMCLink id={id.slice(3)} {...props}>
          {children}
        </PMCLink>
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
