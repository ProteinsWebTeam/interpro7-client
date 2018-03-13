// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Table, { Column, PageSizeSelector, SearchBox } from 'components/Table';
import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';
import Loading from 'components/SimpleCommonComponents/Loading';

import fonts from 'EBI-Icon-fonts/fonts.css';
import global from 'styles/global.css';
import loadable from 'higherOrder/loadable';

const f = foundationPartial(fonts, global);

const schemaProcessData = data => ({
  '@id': '@contains',
  '@type': ['Proteome', 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
  identifier: data.accession,
  name: data.name.name || data.accession,
});
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class ProteomeSubPage extends PureComponent /*:: <{data: Object, customLocation: Object}> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      ok: T.bool,
      payload: T.object,
    }).isRequired,
    customLocation: T.object.isRequired,
  };

  render() {
    if (this.props.data.loading) return <Loading />;
    const {
      data: { payload: { results, count }, loading, ok },
      customLocation: { search },
    } = this.props;
    return (
      <Table
        dataTable={results}
        loading={loading}
        ok={ok}
        actualSize={count}
        query={search}
      >
        <PageSizeSelector />
        <SearchBox search={search.search}>Search</SearchBox>
        <Column
          dataKey="accession"
          renderer={(acc /*: string */, obj) => (
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: {
                    proteomeDB: 'proteome',
                    proteomeAccession: acc,
                  },
                },
              }}
            >
              <span>{acc}</span>
              <SchemaOrgData data={obj} processData={schemaProcessData} />
            </Link>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="name"
          renderer={(
            name /*: string */,
            { accession } /*: {accession: string, source_database: string} */,
          ) => (
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: {
                    proteomeDB: 'proteome',
                    proteomeAccession: accession,
                  },
                },
              }}
            >
              {name}
            </Link>
          )}
        />
        <Column
          dataKey="taxonomy"
          renderer={(taxID /*: string */) => (
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: {
                    db: 'taxonomy',
                    accession: taxID,
                  },
                },
              }}
            >
              {taxID}
            </Link>
          )}
        >
          Taxonomy ID
        </Column>
        <Column
          dataKey="is_reference"
          headerClassName={f('table-center')}
          renderer={(isReference /*: string */) => (
            <div>
              {isReference ? (
                <div title="Proteome reference">
                  <span
                    className={f('icon', 'icon-functional')}
                    data-icon="/"
                  />
                </div>
              ) : null}
            </div>
          )}
        >
          Is Reference
        </Column>
      </Table>
    );
  }
}

export default ProteomeSubPage;
