// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column, PageSizeSelector, Exporter } from 'components/Table';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
// import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import File from 'components/File';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import {
  IDAProtVista,
  TextIDA,
  ida2json,
} from 'components/Entry/DomainArchitectures';

const f = foundationPartial(fonts);
const FAKE_PROTEIN_LENGTH = 1000;

const SimilarProteinsHeaderWithData = (
  {
    accession,
    data: { payload, loading },
    databases,
  } /*: {accession: string, data: {payload: Object, loading: boolean}, databases:Object} */,
) => {
  if (loading || !payload) return <Loading />;
  const idaObj = ida2json(payload.ida);
  return (
    <div>
      <header>
        All the proteins in this page share the domain architecture below with
        the protein with accession <b>{accession}</b>.
      </header>
      <TextIDA accessions={idaObj.accessions} />
      <IDAProtVista
        matches={idaObj.domains}
        length={FAKE_PROTEIN_LENGTH}
        databases={databases}
      />
      <br />
    </div>
  );
};
SimilarProteinsHeaderWithData.propTypes = {
  accession: T.string,
  data: dataPropType,
  databases: T.object,
};

const getUrlForIDA = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.ida = '';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root + descriptionToPath(description).replace('/similar_proteins', ''),
      query: _search,
    });
  },
);
const SimilarProteinsHeader = loadData(getUrlForIDA)(
  SimilarProteinsHeaderWithData,
);
const getAPIURLForSimilarProteins = ({ protocol, hostname, port, root }, ida) =>
  format({
    protocol,
    hostname,
    port,
    pathname:
      root +
      descriptionToPath({
        main: { key: 'protein' },
        protein: { db: 'uniprot' },
      }),
    query: { ida },
  });

const AllProteinDownload = (
  {
    description,
    count,
    ida,
  } /*: {description: Object, count: number, ida: string} */,
) => (
  <File
    fileType="fasta"
    name={`protein-similar-to-${description[description.main.key].accession}.fasta`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
    }}
    search={{ ida }}
  />
);
AllProteinDownload.propTypes = {
  description: T.object,
  count: T.number,
  ida: T.string,
};

const SimilarProteins = (
  {
    data: {
      loading: loadingData,
      payload: {
        metadata: { ida_accession: ida },
      },
    },
    dataIDA: { loading, payload, isStale, url },
    dataBase,
    search,
    state,
  } /*: {
data: {
  loading: boolean,
  payload: Object,
},
dataIDA: {
  loading: boolean,
  isStale: boolean,
  payload: Object,
  url: string,
},
dataBase: {
  payload: Object,
},
search: Object,
state: Object,
}*/,
) => {
  if (loading || loadingData || !payload) return <Loading />;
  return (
    <div className={f('row', 'column')}>
      <SimilarProteinsHeader
        accession={state.customLocation.description.protein.accession}
        databases={(dataBase.payload && dataBase.payload.databases) || {}}
      />
      <Table
        dataTable={payload.results}
        actualSize={payload.count}
        query={search}
        isStale={isStale}
        currentAPICall={url}
        nextAPICall={payload.next}
        previousAPICall={payload.previous}
        notFound={payload.results.length === 0}
      >
        <PageSizeSelector />
        <Exporter>
          <ul>
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <AllProteinDownload
                  description={state.customLocation.description}
                  ida={ida}
                  count={payload.count}
                />
              </div>
              <div>FASTA</div>
            </li>
            <li>
              <Link
                target="_blank"
                href={getAPIURLForSimilarProteins(state.settings.api, ida)}
              >
                Open in API web view
              </Link>
            </li>
          </ul>
        </Exporter>

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
  data: dataPropType.isRequired,
  dataIDA: dataPropType.isRequired,
  dataBase: dataPropType,
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
