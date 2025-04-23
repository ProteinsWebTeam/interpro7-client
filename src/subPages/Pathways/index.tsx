import React from 'react';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import { Renderer } from 'components/Table/Column';

import cssBinder from 'styles/cssBinder';

const css = cssBinder();

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
const links: Record<string, string> = {
  reactome: 'https://reactome.org/content/schema/instance/browser/<id>',
  kegg: 'https://www.genome.jp/dbget-bin/www_bget?map<id>',
  metacyc: 'https://metacyc.org/META/NEW-IMAGE?type=NIL&object=<id>&redirect=T',
};

const schemaProcessData = (data: Array<Pathway>) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'Pathways',
    value: data.map(({ database, id }) => links[database].replace('<id>', id)),
  };
};

const PathwayLink: Renderer<unknown, Pathway> = (
  id: unknown,
  { database }: Pathway,
) => {
  if (links[database]) {
    return (
      <Link
        target="_blank"
        className={css('ext')}
        href={links[database].replace('<id>', String(id))}
      >
        {id}
      </Link>
    );
  }
  return <span>{String(id)}</span>;
};
type Props = {
  data: RequestedData<{
    pathways: Record<string, Array<{ id: string; name: string }>>;
  }>;
};
type Pathway = { id: string; name: string; database: string };

const InteractionsAndPathwaysSubPage = ({ data }: Props) => {
  if (data.loading) return <Loading />;
  if (!data.payload) return null;
  const _data: Array<Pathway> = [];
  for (const [database, pathways] of Object.entries(data.payload.pathways)) {
    _data.push(...pathways.map(({ id, name }) => ({ id, name, database })));
  }

  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      {_data ? (
        <>
          <p>
            Proteins matching this entry have been linked to these pathways.
          </p>
          <SchemaOrgData data={_data} processData={schemaProcessData} />
          <FullyLoadedTable
            data={_data}
            renderers={{
              id: PathwayLink,
            }}
          />
        </>
      ) : (
        <p>This entry has no pathways.</p>
      )}
    </div>
  );
};

export default InteractionsAndPathwaysSubPage;
