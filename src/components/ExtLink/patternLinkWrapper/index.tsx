import React from 'react';
import BaseLink from '../BaseLink';

const patternLinkWrapper = (pattern: string) => {
  const Wrapped = ({ id, target, children, ...props }: BaseLinkProps) => (
    <BaseLink id={id} target={target || '_blank'} pattern={pattern} {...props}>
      {children || id}
    </BaseLink>
  );
  Wrapped.displayName = 'PatternLinkWrapper';
  return Wrapped;
};

export const UniProtLink = patternLinkWrapper(
  'https://www.uniprot.org/uniprotkb/{id}/entry',
);
UniProtLink.displayName = 'UniProtLink';

export const DOILink = patternLinkWrapper('{id}');
DOILink.displayName = 'DOILink';

export const PTMLink = patternLinkWrapper(
  'https://www.uniprot.org/uniprotkb/{id}/entry#ptm_processing',
);
PTMLink.displayName = 'PTMLink';

export const AlphafoldLink = patternLinkWrapper(
  'https://alphafold.ebi.ac.uk/entry/{id}',
);
AlphafoldLink.displayName = 'AlphafoldLink';

export const BFVDLink = patternLinkWrapper(
  'https://bfvd.foldseek.com/cluster/{id}',
);
BFVDLink.displayName = 'BFVDLink';

export default patternLinkWrapper;
