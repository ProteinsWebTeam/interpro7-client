/* eslint no-magic-numbers: [1, {ignore: [3]}] */
import React from 'react';
import Link from 'components/generic/Link';
import T from 'prop-types';

const types = {
  id: T.oneOfType([T.string, T.number]).isRequired,
  children: T.node,
  className: T.string,
  target: T.string,
};

export const BaseLink = ({
  id,
  pattern,
  href,
  newTo,
  to,
  rel,
  className,
  children,
  activeClass,
  ...rest
}) => {
  const props = {
    href: href || newTo || to || (pattern || '').replace('{id}', id),
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
  to: T.string,
  newTo: T.object,
  target: T.string,
  className: T.string,
  activeClass: T.oneOfType([T.string, T.func]),
  children: T.node.isRequired,
};
BaseLink.displayName = 'BaseLink';

const patternLinkWrapper = pattern => {
  const Wrapped = ({ id, target, children, ...props }) => (
    <BaseLink id={id} target={target || '_blank'} pattern={pattern} {...props}>
      {children || id}
    </BaseLink>
  );
  Wrapped.propTypes = types;
  return Wrapped;
};

export const TaxLink = ({ id, target, children, ...props }) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="https://www.ebi.ac.uk/ena/data/view/Taxon:{id}"
    {...props}
  >
    {children || `TaxID ${id}`}
  </BaseLink>
);
TaxLink.propTypes = {
  ...types,
  id: T.number.isRequired,
};
TaxLink.displayName = 'TaxLink';

export const ProteomeLink = ({ id, target, children, ...props }) => (
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

export const PMCLink = ({ id, target, children, ...props }) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="https://europepmc.org/abstract/MED/{id}"
    {...props}
  >
    {children || `PUB${id}`}
  </BaseLink>
);
PMCLink.propTypes = {
  ...types,
  id: T.string.isRequired,
};
PMCLink.displayName = 'PMCLink';

export const DOILink = patternLinkWrapper('{id}');
DOILink.displayName = 'DOILink';

export const GoLink = ({ id, target, className, children, ...props }) => {
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
  'https://www.ebi.ac.uk/pdbe/entry/pdb/{id}'
);
PDBeLink.displayName = 'PDBeLink';

export const PDBe3DLink = patternLinkWrapper(
  'https://www.ebi.ac.uk/pdbe/entry/view3D/{id}/' +
    '?view=entry_index&viewer=jmol&controls=codename_hero'
);
PDBe3DLink.displayName = 'PDBe3DLink';

export const UniProtLink = patternLinkWrapper(
  'http://www.uniprot.org/uniprot/{id}'
);
UniProtLink.displayName = 'UniProtLink';

const ExtLink = ({ id, children, ...props }) => {
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

export default ExtLink;
