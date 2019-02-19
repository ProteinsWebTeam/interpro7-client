// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column, PageSizeSelector } from 'components/Table';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
// import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

const SimilarProteins = (
  {
    data: { loading, payload, isStale },
    search,
    state,
  } /*: {
data: {
  loading: boolean,
  isStale: boolean,
  payload: Object,
},
search: Object,
state: Object,
}*/,
) => {
  if (loading || !payload) return <Loading />;
  return (
    <div className={f('row', 'column')}>
      <p>Similar Proteins</p>
      <Table
        dataTable={payload.results}
        actualSize={payload.count}
        query={search}
        isStale={isStale}
        notFound={payload.results.length === 0}
      >
        <PageSizeSelector />
        <Column
          dataKey="accession"
          renderer={(acc, { source_database: sourceDatabase }) => (
            <>
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: sourceDatabase, accession: acc },
                  },
                }}
              >
                {acc}
              </Link>{' '}
              {sourceDatabase === 'reviewed' && (
                <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf00c;"
                    aria-label="reviewed"
                  />
                </Tooltip>
              )}
            </>
          )}
        >
          Accession
        </Column>
        <Column
          dataKey="name"
          renderer={(name, { accession }) => (
            <Link
              to={{
                description: {
                  main: { key: 'protein' },
                  protein: { db: 'uniprot', accession },
                },
              }}
            >
              {name}
            </Link>
          )}
        >
          Name
        </Column>
        <Column
          dataKey="source_organism"
          renderer={sourceOrganism =>
            sourceOrganism.taxId ? (
              <Link
                to={{
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: {
                      db: 'uniprot',
                      accession: `${sourceOrganism.taxId}`,
                    },
                  },
                }}
              >
                {sourceOrganism.fullName}
              </Link>
            ) : (
              sourceOrganism
            )
          }
        >
          Organism
        </Column>
        <Column dataKey="length">Length</Column>
      </Table>
    </div>
  );
};
SimilarProteins.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
  search: T.object.isRequired,
  state: T.object.isRequired,
};

const mapStateToProps = createSelector(
  searchSelector,
  descriptionSelector,
  state => state,
  (search, description, state) => ({ search, description, state }),
);

export default connect(mapStateToProps)(SimilarProteins);
