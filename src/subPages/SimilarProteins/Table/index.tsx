import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData/ts';

import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import Table, { Column, PageSizeSelector, Exporter } from 'components/Table';

import AllProteinDownload from './AllProteinDownload';
import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';

import cssBinder from 'styles/cssBinder';

import allProteinsButtons from './AllProteinDownload/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import fileStyle from 'components/File/FileButton/style.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(
  ipro,
  fonts,
  allProteinsButtons,
  exporterStyle,
  fileStyle,
);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = (
  data: Array<{ metadata: { source_database: string; accession: string } }>,
) => {
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

const getAPIURLForSimilarProteins = (
  { protocol, hostname, port, root }: ParsedURLServer,
  ida: string,
  db: string,
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

type Props = {
  db: string;
  ida: string;
  search?: Record<string, string>;
  description?: InterProDescription;
  api?: ParsedURLServer;
};
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteinMetadata>, 'IDA'> {}

const SimilarProteinTable = ({
  dataIDA,
  isStaleIDA,
  db,
  ida,
  description,
  search,
  api,
}: LoadedProps) => {
  const { loading, payload, url } = dataIDA || {};
  if (loading || !payload) return <Loading />;
  if (!description || !api) return null;
  return (
    <>
      <SchemaOrgData data={payload.results} processData={schemaProcessData} />
      <Table
        dataTable={payload.results}
        actualSize={payload.count}
        query={search}
        isStale={isStaleIDA}
        currentAPICall={url}
        nextAPICall={payload.next}
        previousAPICall={payload.previous}
        notFound={payload.results.length === 0}
      >
        <PageSizeSelector />
        <Exporter>
          <div className={css('menu-grid')}>
            <AllProteinDownload
              description={description}
              ida={ida}
              db={db}
              count={payload.count}
              fileType="fasta"
            />
            <AllProteinDownload
              description={description}
              ida={ida}
              db={db}
              count={payload.count}
              fileType="json"
            />
            <AllProteinDownload
              description={description}
              ida={ida}
              db={db}
              count={payload.count}
              fileType="tsv"
            />
            <ExternalExportButton
              type={'api'}
              url={getAPIURLForSimilarProteins(api, ida, db)}
            />
          </div>
          <ExternalExportButton
            search={search}
            type={'scriptgen'}
            subpath={descriptionToPath(description)}
          />
        </Exporter>

        <Column
          dataKey="accession"
          renderer={(
            acc: string,
            { source_database: sourceDatabase }: ProteinMetadata,
          ) => (
            <>
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: sourceDatabase, accession: acc },
                  } as InterProPartialDescription,
                }}
              >
                {acc}
              </Link>{' '}
              {sourceDatabase === 'reviewed' && (
                <Tooltip title="Reviewed by UniProtKB curators">
                  <span
                    className={css('icon', 'icon-common')}
                    data-icon="&#xf2f0;"
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
          renderer={(name: string, { accession }: ProteinMetadata) => (
            <Link
              to={{
                description: {
                  main: { key: 'protein' },
                  protein: { db: 'uniprot', accession },
                } as InterProPartialDescription,
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
          renderer={(sourceOrganism: SourceOrganism) =>
            sourceOrganism.taxId ? (
              <Link
                to={{
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: {
                      db: 'uniprot',
                      accession: `${sourceOrganism.taxId}`,
                    } as InterProPartialDescription,
                  },
                }}
              >
                {sourceOrganism.fullName}
              </Link>
            ) : (
              String(sourceOrganism)
            )
          }
        >
          Organism
        </Column>
        <Column dataKey="length">Length</Column>
        <Column dataKey="gene">Gene</Column>
        <Column
          dataKey="in_alphafold"
          renderer={(inAlphafold: boolean, { accession }: ProteinMetadata) =>
            inAlphafold ? (
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: 'uniprot', accession, detail: 'alphafold' },
                  } as InterProPartialDescription,
                }}
              >
                AlphaFold
              </Link>
            ) : null
          }
        >
          Predicted structure
        </Column>
      </Table>
    </>
  );
};

const mapStateToPropsForIDA = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.search,
  (_: GlobalState, props: Props) => props.ida,
  (_: GlobalState, props: Props) => props.db,
  ({ protocol, hostname, port, root }, search, ida, db) => {
    // omit elements from search
    const { type, search: _, ...restOfSearch } = search;

    // modify search
    restOfSearch.ida = ida;

    const description: InterProPartialDescription = {
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.settings.api,
  (search, description, api) => ({ search, description, api }),
);

export default loadData<PayloadList<ProteinMetadata>, 'IDA'>({
  getUrl: mapStateToPropsForIDA,
  propNamespace: 'IDA',
  mapStateToProps,
} as LoadDataParameters)(SimilarProteinTable);
