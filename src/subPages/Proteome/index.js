// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Table, { Column, PageSizeSelector, SearchBox } from 'components/Table';
import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts);

class ProteomeSubPage extends PureComponent /*:: <{data: Object}> */ {
  static propTypes = {
    data: T.object.isRequired,
    location: T.object.isRequired,
  };

  render() {
    if (this.props.data.loading)
      return <div className={f('columns')}>Loading…</div>;
    const {data: {payload: {results, count}}, location: {search}} = this.props;
    return (
      <Table
        dataTable={results}
        actualSize={count}
        query={search}
        pathname={''}
      >
        <PageSizeSelector />
        <Column
          dataKey="accession"
          renderer={(
            acc /*: string */,
          ) => (
            <Link
              newTo={{
                description: {
                  mainType: 'organism',
                  mainDB: 'proteome',
                  mainAccession: acc,
                },
              }}
            >
                <span>{acc}</span>
            </Link>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="name"
          renderer={(
            name /*: string */,
            {
              accession,
            } /*: {accession: string, source_database: string} */,
          ) => (
            <Link
              newTo={{
                description: {
                  mainType: 'organism',
                  mainDB: 'proteome',
                  mainAccession: accession,
                },
              }}
            >
              {name}
            </Link>
          )}
        />
        <Column
          dataKey="taxonomy"
          renderer={(
            taxID /*: string */,
          ) => (
            <Link
              newTo={{
                description: {
                  mainType: 'organism',
                  mainDB: 'taxonomy',
                  mainAccession: String(taxID),
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
          className={f('table-center')}
          renderer={(isReference /*: string */) => (
            <div>
              {isReference ? (
                <div
                  title="Proteome reference"
                >
                  <span
                    className={f('icon', 'icon-functional')}
                    data-icon={'/'}
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
