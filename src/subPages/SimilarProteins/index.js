// @flow
import React, { useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';
import Loading from 'components/SimpleCommonComponents/Loading';
import Table, { Column, PageSizeSelector, Exporter } from 'components/Table';
import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import loadable from 'higherOrder/loadable';
import ToggleSwitch from 'components/ToggleSwitch';

// import loadWebComponent from 'utils/load-web-component';
// import ProtvistaInterproTrack from 'protvista-interpro-track';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

// $FlowFixMe
import File from 'components/File';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import { ida2json } from 'components/Entry/DomainArchitectures';
import IDAProtVista from 'components/Entry/DomainArchitectures/IDAProtVista';
import IDAOptions from 'components/Entry/DomainArchitectures/Options';
import TextIDA from 'components/Entry/DomainArchitectures/TextIDA';

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

const formatDomainsPayload = (payload, loading, ida) => {
  if (loading || !payload) return null;
  const domainsMap = {};
  payload.results.forEach((result) => {
    domainsMap[result.metadata.accession.toLowerCase()] = [
      ...result.proteins[0].entry_protein_locations,
    ];
    if (result.metadata.integrated) {
      domainsMap[result.metadata.integrated.toLowerCase()] = [
        ...result.proteins[0].entry_protein_locations,
      ];
    }
  });
  const domains = [];
  ida.split(/[:-]/).forEach((domain) => {
    domains.push({
      entry: domain.toUpperCase(),
      coordinates: domainsMap[domain.toLowerCase()].splice(0, 1),
      name:
        payload.results?.[0]?.extra_fields?.short_name || domain.toUpperCase(),
    });
  });
  return {
    accession: payload.results?.[0]?.proteins?.[0]?.accession,
    length: payload.results?.[0]?.proteins?.[0]?.protein_length,
    domains,
  };
};

const SimilarProteinsHeaderWithData = (
  {
    accession,
    data: { payload, loading },
    dataDomain: { payload: payloadDomain, loading: loadingDomain },
    databases,
    idaAccessionDB,
    idaLabel,
  } /*: {
      accession: string,
      data: {payload: Object, loading: boolean},
      dataDomain: {payload: Object, loading: boolean},
      databases: Object,
      idaAccessionDB: string,
      idaLabel: string,
    } */,
) => {
  if (loading || !payload) return <Loading />;
  const representative = formatDomainsPayload(
    payloadDomain,
    loadingDomain,
    payload.ida,
  );
  if (!representative) return null;
  const idaObj = ida2json(payload.ida, representative, idaAccessionDB);
  return (
    <div>
      <header>
        All the proteins in this page share the domain architecture below with
        the protein with accession <b>{accession}</b>.
        <IDAOptions />
      </header>
      <TextIDA accessions={idaObj.accessions} representative={accession} />
      <IDAProtVista
        matches={idaObj.domains}
        length={idaObj?.length || FAKE_PROTEIN_LENGTH}
        maxLength={idaObj?.length || FAKE_PROTEIN_LENGTH}
        databases={databases}
        attributeForLabel={idaLabel}
      />
      <br />
    </div>
  );
};
SimilarProteinsHeaderWithData.propTypes = {
  accession: T.string,
  data: dataPropType,
  dataDomain: dataPropType,
  databases: T.object,
  idaAccessionDB: T.string,
  idaLabel: T.string,
  changeSettingsRaw: T.func,
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
const getUrlForPfamDomains = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description) => {
    const newDescription = {
      main: { key: 'entry' },
      entry: { db: 'pfam' },
      protein: {
        accession: description.protein.accession,
        db: 'uniprot',
        isFilter: true,
      },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDescription),
      query: {
        extra_fields: 'short_name',
      },
    });
  },
);

const mapStateToPropsAccessionDB = createSelector(
  (state) => state.settings.ui,
  ({ idaAccessionDB, idaLabel }) => ({
    idaAccessionDB,
    idaLabel,
  }),
);

const SimilarProteinsHeader = loadData({
  getUrl: getUrlForPfamDomains,
  propNamespace: 'Domain',
})(
  loadData({
    getUrl: getUrlForIDA,
    mapStateToProps: mapStateToPropsAccessionDB,
  })(React.memo(SimilarProteinsHeaderWithData)),
);

const getAPIURLForSimilarProteins = (
  { protocol, hostname, port, root },
  ida,
  db,
) =>
  format({
    protocol,
    hostname,
    port,
    pathname:
      root +
      descriptionToPath({
        main: { key: 'protein' },
        protein: { db: db },
      }),
    query: { ida },
  });

const AllProteinDownload = (
  {
    description,
    count,
    ida,
    fileType,
    db,
  } /*: {description: Object, count: number, ida: string, fileType: string, db: string} */,
) => (
  <File
    fileType={fileType}
    name={`protein-similar-to-${
      description[description.main.key].accession
    }.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: db },
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
  db: T.string,
};

const _SimilarProteinTable = (
  { dataIDA: { loading, payload, isStale, url }, db, ida, state, search } /*: {
dataIDA: {
  loading: boolean,
  isStale: boolean,
  payload: Object,
  url: string,
},
db: string,
ida: string,
state: Object,
search: Object,
}
*/,
) => {
  if (loading || !payload) return <Loading />;
  return (
    <>
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
              db={db}
              count={payload.count}
              fileType="fasta"
              name="fasta"
            />
            <label htmlFor="json">JSON</label>
            <AllProteinDownload
              description={state.customLocation.description}
              ida={ida}
              db={db}
              count={payload.count}
              name="json"
              fileType="json"
            />
            <label htmlFor="tsv">TSV</label>
            <AllProteinDownload
              description={state.customLocation.description}
              ida={ida}
              db={db}
              count={payload.count}
              name="tsv"
              fileType="tsv"
            />
            <label htmlFor="api">API</label>
            <Link
              target="_blank"
              href={getAPIURLForSimilarProteins(state.settings.api, ida, db)}
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
    </>
  );
};
_SimilarProteinTable.propTypes = {
  dataIDA: dataPropType.isRequired,
  db: T.string.isRequired,
  ida: T.string.isRequired,
  search: T.object.isRequired,
  state: T.object.isRequired,
};

const mapStateToPropsForIDA = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.search,
  (_, props) => props.ida,
  (_, props) => props.db,
  ({ protocol, hostname, port, root }, search, ida, db) => {
    // omit elements from search
    const { type, search: _, ...restOfSearch } = search;

    // modify search
    restOfSearch.ida = ida;

    const description = {
      main: { key: 'protein' },
      protein: { db: db },
    };
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: restOfSearch,
    });
  },
);
const SimilarProteinsTable = loadData({
  getUrl: mapStateToPropsForIDA,
  propNamespace: 'IDA',
})(_SimilarProteinTable);

const SimilarProteins = (
  {
    data: {
      loading: loadingData,
      payload: {
        metadata: { ida_accession: ida },
      },
    },
    dataBase,
    search,
    state,
  } /*: {
data: {
  loading: boolean,
  payload: Object,
},
dataBase: {
  payload: Object,
},
search: Object,
state: Object,
}*/,
) => {
  const [similarProtDb, setSimilarProtDb] = useState('uniprot');
  if (loadingData) return <Loading />;

  // loadWebComponent(() => ProtvistaInterproTrack).as('protvista-interpro-track');
  return (
    <div className={f('row', 'column')}>
      <SimilarProteinsHeader
        accession={state.customLocation.description.protein.accession}
        databases={(dataBase.payload && dataBase.payload.databases) || {}}
      />

      <div className={f('similar-proteins-selector-panel')}>
        <p>The below table lists the similar proteins from</p>
        <Tooltip title="Switch to view similar proteins from UniProt or Reviewed databases">
          <ToggleSwitch
            switchCond={similarProtDb === 'uniprot'}
            name={'proteinDB'}
            id={'proteinDB-input'}
            SRLabel={'View proteins from'}
            onValue={'UniProt'}
            offValue={'Reviewed'}
            handleChange={() =>
              setSimilarProtDb(
                similarProtDb === 'uniprot' ? 'reviewed' : 'uniprot',
              )
            }
            addAccessionStyle={true}
          />
        </Tooltip>
      </div>

      <SimilarProteinsTable
        state={state}
        search={search}
        ida={ida}
        db={similarProtDb}
      />
    </div>
  );
};
SimilarProteins.propTypes = {
  data: dataPropType.isRequired,
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
