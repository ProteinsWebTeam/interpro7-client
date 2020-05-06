// @flow
import React from 'react';
import T from 'prop-types';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';

const f = foundationPartial();

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
const links = {
  reactome: 'https://reactome.org/content/schema/instance/browser/<id>',
  kegg: 'https://www.genome.jp/dbget-bin/www_bget?map<id>',
  metacyc: 'https://metacyc.org/META/NEW-IMAGE?type=NIL&object=<id>&redirect=T',
};

const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'Pathways',
    value: data.map(({ database, id }) => links[database].replace('<id>', id)),
  };
};

const PathwayLink = (id, { database }) => {
  if (links[database]) {
    return (
      <Link
        target="_blank"
        className={f('ext')}
        href={links[database].replace('<id>', id)}
      >
        {id}
      </Link>
    );
  }
  return <span>{id}</span>;
};
PathwayLink.propTypes = {
  accession: T.string.isRequired,
  identifier: T.string,
  type: T.string,
};

const InteractionsAndPathwaysSubPage = (
  {
    data,
  } /*: {data: {loading: boolean, payload: {pathways: {[string]: Array<Object>}} }}*/,
) => {
  if (data.loading) return <Loading />;
  const _data = [];
  for (const [database, pathways] of Object.entries(data.payload.pathways)) {
    // $FlowFixMe
    _data.push(...pathways.map(({ id, name }) => ({ id, name, database })));
  }

  return (
    <div className={f('row', 'column')}>
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
InteractionsAndPathwaysSubPage.propTypes = {
  data: T.object.isRequired,
};

export default InteractionsAndPathwaysSubPage;
