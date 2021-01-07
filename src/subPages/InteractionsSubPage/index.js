// @flow
import React from 'react';
import T from 'prop-types';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import f from 'styles/foundation';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'Interactions',
    value: data.map(({ molecule_1: m1, molecule_2: m2 }) => ({
      '@type': 'CreativeWork',
      additionalType: 'Interaction',
      additionalProperty: {
        '@type': 'PropertyValue',
        additionalType: 'bio:Protein',
        name: 'Interactors',
        value: [
          `https://www.ebi.ac.uk/interpro/protein/uniprot/${m1?.accession}`,
          `https://www.ebi.ac.uk/interpro/protein/uniprot/${m2?.accession}`,
        ],
      },
    })),
  };
};

const Molecule = ({ accession, identifier, type }) =>
  type === 'protein' ? (
    <Link
      to={{
        description: {
          main: { key: 'protein' },
          protein: { db: 'uniprot', accession },
        },
      }}
    >
      {identifier} ({accession})
    </Link>
  ) : (
    <span>
      {identifier} ({accession})
    </span>
  );
Molecule.propTypes = {
  accession: T.string.isRequired,
  identifier: T.string,
  type: T.string,
};
const moleculeToString = ({ accession, identifier }) =>
  `${identifier}${accession}`;

const InteractionsSubPage = ({ data } /*: {data: Object}*/) => {
  if (data.loading) return <Loading />;
  const _data = data?.payload?.interactions;
  return (
    <div className={f('row', 'column')}>
      {_data ? (
        <>
          <p>
            Proteins matching this entry have been experimentally proven to be
            involved in Protein:Protein interactions.
          </p>
          <SchemaOrgData data={_data} processData={schemaProcessData} />

          <FullyLoadedTable
            data={_data}
            renderers={{
              molecule_1: Molecule,
              molecule_2: Molecule,
            }}
            columnToString={{
              molecule_1: moleculeToString,
              molecule_2: moleculeToString,
            }}
          />
        </>
      ) : (
        <p>This entry has no interactions.</p>
      )}
    </div>
  );
};
InteractionsSubPage.propTypes = {
  data: T.object.isRequired,
};

export default InteractionsSubPage;
