// @flow
import React, { createElement } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import { TaxLink, PDBeLink, UniProtLink } from 'components/ExtLink';

export const Name = (
  {
    name: { name, short },
    accession,
  } /*: {name: {name: string, short?: string}, accession: string} */,
) =>
  <div>
    <h3>
      {name} ({accession})
    </h3>
    {short &&
      <p style={{ color: 'gray' }}>
        Short name: {short}
      </p>}
  </div>;
Name.propTypes = {
  name: T.shape({
    short: T.string,
    name: T.string.isRequired,
  }).isRequired,
  accession: T.string.isRequired,
};

const extOriginDBLookup = {
  pdb: {
    nicerName: 'PDBe',
    component: PDBeLink,
  },
  reviewed: {
    nicerName: 'reviewed',
    component: UniProtLink,
  },
  unreviewed: {
    nicerName: 'unreviewed',
    component: UniProtLink,
  },
};

export const ExtOriginDB = (
  { source, accession } /*: {source: string, accession: string | number} */,
) => {
  const desc = extOriginDBLookup[source.toLowerCase()];
  if (!desc) return null;
  return createElement(desc.component, { id: accession }, [
    `(${desc.nicerName || source} external link)`,
  ]);
};
ExtOriginDB.propTypes = {
  source: T.string.isRequired,
  accession: T.oneOfType([T.string, T.number]).isRequired,
};

export const OriginDB = (
  { source, accession } /*: {source: string, accession: string | number} */,
) =>
  <p>
    Source DB:{' '}
    <Link
      newTo={location => ({
        ...location,
        description: {
          mainType: location.description.mainType,
          mainDB: source,
        },
      })}
    >
      {source}
    </Link>{' '}
    <ExtOriginDB source={source} accession={accession} />
  </p>;
OriginDB.propTypes = {
  source: T.string.isRequired,
  accession: T.oneOfType([T.string, T.number]).isRequired,
};

export const SourceOrganism = (
  { taxid, name } /*: {taxid: number, name: string} */,
) =>
  <p>
    Source Organism:{' '}
    <TaxLink id={taxid}>
      {name} ({taxid})
    </TaxLink>
  </p>;
SourceOrganism.propTypes = {
  taxid: T.number.isRequired,
  name: T.string.isRequired,
};
