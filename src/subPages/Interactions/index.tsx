import React from 'react';

import FullyLoadedTable, {
  Column2StringFn,
} from 'components/Table/FullyLoadedTable';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import { Renderer } from 'src/components/Table/Column';

const css = cssBinder();

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
const schemaProcessData = (data: Interaction[]) => {
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

const Molecule: Renderer<unknown, Interaction> = (molecule: unknown) => {
  const { accession, identifier, type } = molecule as InteractionMolecule;
  return type === 'protein' ? (
    <Link
      to={{
        description: {
          main: { key: 'protein' },
          // The split below is in cases the accession points to an isoform e.g. O00305-2
          // TODO: Update link to directly point to isoforms
          protein: { db: 'uniprot', accession: accession.split('-')[0] },
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
};
const moleculeToString: Column2StringFn<Interaction> = (molecule: unknown) => {
  const { accession, identifier } = molecule as InteractionMolecule;
  return `${identifier}${accession}`;
};

type Props = {
  data: RequestedData<InteractionsPayload>;
};

const InteractionsSubPage = ({ data }: Props) => {
  if (data.loading) return <Loading />;
  const _data = data?.payload?.interactions;
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
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

export default InteractionsSubPage;
