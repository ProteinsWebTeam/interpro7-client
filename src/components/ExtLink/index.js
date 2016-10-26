/* eslint no-magic-numbers: [1, {ignore: [3]}] */
import React, {PropTypes as T} from 'react';

const types = {
  id: T.oneOfType([T.string, T.number]).isRequired,
  children: T.node,
  className: T.array,
  target: T.string,
};

export const BaseLink = ({id, pattern, target, className, children}) => (
  <a target={target} href={pattern.replace('{id}', id)} className={className}>
    {children}
  </a>
);
BaseLink.propTypes = {
  id: T.oneOfType([T.string, T.number]).isRequired,
  pattern: T.string.isRequired,
  target: T.string.isRequired,
  className: T.array,
  children: T.node.isRequired,
};

const patternLinkWrapper = pattern => {
  const Wrapped = ({id, target, children}) => (
    <BaseLink id={id} target={target || '_blank'} pattern={pattern}>
      {children || id}
    </BaseLink>
  );
  Wrapped.propTypes = types;

  return Wrapped;
};

export const TaxLink = ({id, target, children}) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="https://www.ebi.ac.uk/ena/data/view/Taxon:{id}"
  >
    {children || `TaxID ${id}`}
  </BaseLink>
);
TaxLink.propTypes = {
  ...types,
  id: T.number.isRequired,
};

export const PMCLink = ({id, target, children}) => (
  <BaseLink
    id={id}
    target={target || '_blank'}
    pattern="https://europepmc.org/abstract/MED/{id}"
  >
    {children || `PUB${id}`}
  </BaseLink>
);
PMCLink.propTypes = {
  ...types,
  id: T.number.isRequired,
};

export const DOILink = patternLinkWrapper('{id}');

export const GoLink = ({id, target, className, children}) => {
  const pattern = (
    'http://www.ebi.ac.uk/ols/beta/ontologies/go/terms?iri=' +
    'http://purl.obolibrary.org/obo/{id}'
  );
  return (
    <BaseLink
      id={id.replace(':', '_')}
      target={target || '_blank'}
      pattern={pattern}
      className={className}
    >
      {children || id.replace('_', ':')}
    </BaseLink>
  );
};
GoLink.propTypes = types;

export const PDBeLink = patternLinkWrapper(
  'https://www.ebi.ac.uk/pdbe/entry/pdb/{id}'
);

export const UniProtLink = patternLinkWrapper(
  'http://www.uniprot.org/uniprot/{id}'
);

const ExtLink = ({id, children}) => {
  switch (true) {
    case id.startsWith('PUB'):
      return <PMCLink id={id.slice(3)}>{children}</PMCLink>;
    default:
      throw Error('Not a supported reference link');
  }
};
ExtLink.propTypes = types;

export default ExtLink;
