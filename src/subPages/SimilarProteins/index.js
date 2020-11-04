// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { toggleAccessionDBForIDA } from 'actions/creators';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column, PageSizeSelector, Exporter } from 'components/Table';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import loadable from 'higherOrder/loadable';
import ToggleSwitch from 'components/ToggleSwitch';

import loadWebComponent from 'utils/load-web-component';
import ProtvistaInterproTrack from 'protvista-interpro-track';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

import File from 'components/File';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import {
  IDAProtVista,
  TextIDA,
  ida2json,
} from 'components/Entry/DomainArchitectures';

const f = foundationPartial(fonts, localStyle, exporterStyle);
const FAKE_PROTEIN_LENGTH = 1000;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'SimilarProteins',
    value: data.map(
      (p) =>
        `https://www.ebi.ac.uk/interpro/protein/${p.metadata.source_database}/${p.metadata.accession}/`,
    ),
  };
};

const SimilarProteinsHeaderWithData = (
  {
    accession,
    data: { payload, loading },
    databases,
    idaAccessionDB,
    toggleAccessionDBForIDA,
  } /*: {accession: string, data: {payload: Object, loading: boolean}, databases: Object, idaAccessionDB: string, toggleAccessionDBForIDA: function} */,
) => {
  if (loading || !payload) return <Loading />;
  const idaObj = ida2json(payload.ida, idaAccessionDB);
  return (
    <div>
      <header>
        All the proteins in this page share the domain architecture below with
        the protein with accession <b>{accession}</b>.
        <div className={f('accession-selector-panel')}>
          <Tooltip title="Toogle between domain architectures based on Pfam and InterPro entries">
            <ToggleSwitch
              switchCond={idaAccessionDB === 'pfam'}
              name={'accessionDB'}
              id={'accessionDB-input'}
              SRLabel={'Use accessions from'}
              onValue={'Pfam'}
              offValue={'InterPro'}
              handleChange={toggleAccessionDBForIDA}
              addAccessionStyle={true}
            />
          </Tooltip>
        </div>
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
  idaAccessionDB: T.string,
  toggleAccessionDBForIDA: T.func,
};

const getUrlForIDA = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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

const mapStateToPropsAccessionDB = createSelector(
  (state) => state.ui.idaAccessionDB,
  (idaAccessionDB) => ({
    idaAccessionDB,
  }),
);

const SimilarProteinsHeader = loadData({
  getUrl: getUrlForIDA,
  mapStateToProps: mapStateToPropsAccessionDB,
  mapDispatchToProps: { toggleAccessionDBForIDA },
})(SimilarProteinsHeaderWithData);

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
    fileType,
  } /*: {description: Object, count: number, ida: string, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`protein-similar-to-${
      description[description.main.key].accession
    }.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
    }}
    search={{ ida }}
    endpoint="protein"
  />
);
AllProteinDownload.propTypes = {
  description: T.object,
  count: T.number,
  ida: T.string,
  fileType: T.string,
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
  loadWebComponent(() => ProtvistaInterproTrack).as('protvista-interpro-track');
  return (
    <div className={f('row', 'column')}>
      <SimilarProteinsHeader
        accession={state.customLocation.description.protein.accession}
        databases={(dataBase.payload && dataBase.payload.databases) || {}}
      />
      <SchemaOrgData data={payload.results} processData={schemaProcessData} />

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
          <div className={f('menu-grid')}>
            <label htmlFor="fasta">FASTA</label>
            <AllProteinDownload
              description={state.customLocation.description}
              ida={ida}
              count={payload.count}
              fileType="fasta"
              name="fasta"
            />
            <label htmlFor="json">JSON</label>
            <AllProteinDownload
              description={state.customLocation.description}
              ida={ida}
              count={payload.count}
              name="json"
              fileType="json"
            />
            <label htmlFor="tsv">TSV</label>
            <AllProteinDownload
              description={state.customLocation.description}
              ida={ida}
              count={payload.count}
              name="tsv"
              fileType="tsv"
            />
            <label htmlFor="api">API</label>
            <Link
              target="_blank"
              href={getAPIURLForSimilarProteins(state.settings.api, ida)}
              className={f('button', 'hollow', 'imitate-progress-button')}
              name="api"
            >
              <span
                className={f('icon', 'icon-common', 'icon-export')}
                data-icon="&#xf233;"
              />
              <span className={f('file-label')}>Web View</span>
            </Link>
          </div>
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
          renderer={(sourceOrganism) =>
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
  (state) => state,
  (search, description, state) => ({ search, description, state }),
);

export default connect(mapStateToProps)(SimilarProteins);
