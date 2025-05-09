import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import { toPlural } from 'utils/pages/toPlural';
import loadable from 'higherOrder/loadable';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import config from 'config';

import MatchesByPrimary, { GenericMatch } from './MatchesByPrimary';
import ProteinDownloadRenderer from './ProteinDownloadRenderer';
import FileExporter from './FileExporter';

import Table, {
  Column,
  PageSizeSelector,
  SearchBox,
  Exporter,
  HighlightToggler,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';
import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';
import LazyImage from 'components/LazyImage';
import Lazy from 'wrappers/Lazy';
import loadWebComponent from 'utils/load-web-component';
import { toPublicAPI } from 'utils/url';

import {
  getReversedUrl,
  includeTaxonFocusedOnURL,
} from 'higherOrder/loadData/defaults';

import { endpoint2type } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import tableStyles from 'components/Table/style.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const css = cssBinder(fonts, localStyle, exporterStyle, tableStyles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemamap: Record<
  Endpoint,
  Partial<Record<Endpoint, string | undefined>>
> = {
  entry: {
    protein: 'bio:ProteinAnnotation',
    taxonomy: 'bio:isContainedIn',
    proteome: 'bio:isContainedIn',
    structure: 'bio:isContainedIn',
    set: 'bio:isContainedIn',
  },
  protein: {
    entry: 'bio:hasProteinAnnotation',
    structure: 'bio:isContainedIn',
  },
  structure: {
    entry: 'bio:ProteinAnnotation',
    protein: 'bio:contains',
    taxonomy: 'bio:isContainedIn',
    proteome: 'bio:isContainedIn',
  },
  taxonomy: {
    entry: 'bio:contains',
    protein: 'bio:contains',
    structure: 'bio:contains',
    proteome: 'bio:contains',
  },
  proteome: {
    entry: 'bio:contains',
    protein: 'bio:contains',
    structure: 'bio:contains',
  },
  set: {
    entry: 'bio:contains',
    protein: 'bio:contains',
    structure: 'bio:contains',
    taxonomy: 'bio:contains',
    proteome: 'bio:contains',
  },
};

const schemaProcessData = ({
  data,
  primary,
  secondary,
}: {
  data: {
    accession: string;
    source_database: string;
    name: string;
  };
  primary: Endpoint;
  secondary: Endpoint;
}) => {
  const name = schemamap[secondary][primary] || '';
  const type = endpoint2type[primary];
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: name,
    value: [
      {
        '@type': 'StructuredValue',
        additionalType: type,
        '@id':
          config.root.website.protocol +
          config.root.website.href +
          descriptionToPath({
            main: { key: primary },
            [primary]: { db: data.source_database, accession: data.accession },
          }),
        name: data.name,
        identifier: data.accession,
      },
    ],
  };
};

type AccSearchData = {
  metadata: {
    accession: string;
    name: { name: string; short: string };
    counters: unknown;
  };
} & Record<string, Array<Record<string, unknown>>>;

const includeAccessionSearch = (
  dataTable: Array<{ accession: string }>,
  accessionSearch: AccSearchData,
  primary: Endpoint,
  secondary: Endpoint,
  mainData: Metadata,
) => {
  const indexInPayload = dataTable.findIndex(
    ({ accession }) => accession === accessionSearch.metadata.accession,
  );
  const accMatch = {
    ...accessionSearch.metadata,
    exact: true,
    counters: {
      extra_fields: {
        counters: accessionSearch.metadata.counters,
      },
    },
    match: {
      [primary]: accessionSearch.metadata,
      [secondary]: {
        ...mainData,
        ...accessionSearch[toPlural(secondary) as Endpoint][0],
      },
    },
    name:
      accessionSearch.metadata.name.short ||
      accessionSearch.metadata.name.name ||
      accessionSearch.metadata.name,
  };
  if (indexInPayload >= 0) {
    dataTable.splice(indexInPayload, 1);
  }
  dataTable.splice(0, 0, accMatch);
};

type Props = {
  primary?: Endpoint;
  secondary?: Endpoint;
  matches: Array<GenericMatch>;
  search?: InterProLocationSearch;
  description?: InterProDescription;
  hash?: string;
  state?: GlobalState;
  databases: DBsInfo;
  dbCounters?: MetadataCounters;
  mainData: Metadata;
  accessionSearch?: AccSearchData;
  focusType?: string;
  currentAPICall?: string;
  nextAPICall?: string;
  previousAPICall?: string;
  status?: number;
  actualSize: number;
  isStale: boolean;
};
type SupportedEndpoint = 'entry' | 'protein' | 'structure';
// List of all matches, many to many
const Matches = ({
  matches,
  primary,
  secondary,
  actualSize,
  isStale,
  search,
  description,
  hash,
  state,
  databases,
  dbCounters,
  mainData,
  accessionSearch,
  currentAPICall,
  nextAPICall,
  previousAPICall,
  focusType,
  status,
  ...props
}: Props) => {
  const [focused, setFocused] = useState<string | null>(null);
  useEffect(() => {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }, []);

  let aggSize = actualSize;
  const dataTable = matches.map((e) => ({
    ...e[primary as SupportedEndpoint],
    accession: String(e[primary as SupportedEndpoint]?.accession),
    match: e,
  }));
  if (accessionSearch && primary && secondary) {
    const prevSize = dataTable.length;
    includeAccessionSearch(
      dataTable,
      accessionSearch,
      primary,
      secondary,
      mainData,
    );
    aggSize += prevSize - dataTable.length;
  }

  const isTaxonomySubpage = primary === 'taxonomy' && secondary === 'entry';

  /*  For matches in subpages, the URL is a composite one (e.g /entry/pfam/protein/UniProt)
      The the browser URL needs to be reversed so that it is accepted by the API (e.g. /entry/pfam/protein/UniProt)
      This already happens for the Browsable API button, but it doesn't for the script generator (which at this time uses the descriptionToPath function).
      The processedSubPath variable will store the subpath computed based on the reversed URL.
  */
  const reversedURL = toPublicAPI(
    includeTaxonFocusedOnURL(getReversedUrl(state), focused),
  );

  const urlNoParams = reversedURL.split('?')[0];
  const processedSubPath = '/' + urlNoParams.split('/api/')[1];

  return (
    <Table
      dataTable={dataTable}
      actualSize={aggSize}
      query={search}
      isStale={isStale}
      notFound={matches.length === 0 && !accessionSearch}
      contentType={primary}
      databases={databases}
      withTree={primary === 'taxonomy'}
      withSunburst={isTaxonomySubpage}
      withKeySpecies={isTaxonomySubpage}
      dbCounters={dbCounters}
      rowClassName={(row) =>
        css({ exact: (row as Record<string, unknown>).exact })
      }
      nextAPICall={nextAPICall}
      previousAPICall={previousAPICall}
      currentAPICall={currentAPICall}
      status={status}
      onFocusChanged={setFocused}
      alwaysShowTotalNB={true}
    >
      <PageSizeSelector />
      {!(
        isTaxonomySubpage && ['sunburst', 'keyspecies'].includes(hash || '')
      ) && <SearchBox loading={isStale} />}
      <HighlightToggler />
      {description?.main.key !== 'result' &&
        !(
          isTaxonomySubpage && ['sunburst', 'keyspecies'].includes(hash || '')
        ) && (
          <Exporter>
            <div className={css('menu-grid')}>
              {primary && secondary && (
                <>
                  {primary === 'protein' && (
                    <>
                      <FileExporter
                        description={description}
                        count={actualSize}
                        search={search}
                        fileType="fasta"
                        primary={primary}
                        secondary={secondary}
                        focused={focused}
                      />
                    </>
                  )}
                  <FileExporter
                    description={description}
                    count={actualSize}
                    search={search}
                    fileType="tsv"
                    primary={primary}
                    secondary={secondary}
                    focused={focused}
                  />
                  <FileExporter
                    description={description}
                    count={actualSize}
                    search={search}
                    fileType="json"
                    primary={primary}
                    secondary={secondary}
                    focused={focused}
                  />
                </>
              )}

              <ExternalExportButton
                type={'api'}
                url={toPublicAPI(
                  includeTaxonFocusedOnURL(getReversedUrl(state), focused),
                )}
              />
              <ExternalExportButton
                search={search}
                type={'scriptgen'}
                subpath={processedSubPath}
              />
            </div>
          </Exporter>
        )}
      <Column
        dataKey="accession"
        renderer={(
          acc: string,
          obj: { source_database: string; type: string },
        ) => {
          const { source_database: sourceDatabase } = obj;
          const cellContent = (
            <span className={css('acc-row')}>
              {obj.source_database === 'interpro' ? (
                <interpro-type
                  type={obj.type.replace('_', ' ')}
                  dimension=".8em"
                />
              ) : null}
              <HighlightedText
                text={acc}
                textToHighlight={search?.search as string}
              />
            </span>
          );
          return (
            <>
              <SchemaOrgData
                data={{ data: obj, primary, secondary }}
                processData={schemaProcessData}
              />
              {focusType === 'taxonomy' ? (
                cellContent
              ) : (
                <Link
                  to={
                    primary && {
                      description: {
                        main: { key: primary },
                        [primary]: { db: sourceDatabase, accession: acc },
                      },
                    }
                  }
                >
                  {cellContent}
                </Link>
              )}
              {primary === 'protein' && sourceDatabase === 'reviewed' ? (
                <Tooltip title="Reviewed by UniProtKB curators">
                  <span
                    className={css('icon', 'icon-common')}
                    data-icon="&#xf2f0;"
                    aria-label="reviewed"
                  />
                </Tooltip>
              ) : null}
            </>
          );
        }}
        cellStyle={{
          whiteSpace: 'nowrap',
        }}
      >
        {focusType === 'taxonomy' ? 'Tax ID' : 'Accession'}
      </Column>
      <Column
        dataKey="counters.extra_fields.short_name"
        displayIf={primary === 'entry'}
        renderer={(
          name: string,
          {
            accession,
            short_name,
            source_database: sourceDatabase,
          }: { short_name: string; accession: string; source_database: string },
        ) => (
          <Link
            to={
              primary && {
                description: {
                  main: { key: primary },
                  [primary]: { db: sourceDatabase, accession },
                },
              }
            }
          >
            <HighlightedText
              // If name is != ∅, short_name in the counter was found (Protein page case)
              // If name is ∅, it means that the short name from the counters was not found (InterProScan results page case), so display short_name from renderer
              // If short_name from renderer is null, then leave the cell blank
              text={name == '∅' ? (short_name ? short_name : '') : name}
              textToHighlight={search?.search as string}
            />
          </Link>
        )}
      >
        Short Name
      </Column>
      <Column
        dataKey="name"
        renderer={(
          name: string,
          {
            accession,
            source_database: sourceDatabase,
          }: { accession: string; source_database: string },
        ) => (
          <>
            {focusType === 'taxonomy' || focusType === 'proteome' ? (
              <HighlightedText
                text={name}
                textToHighlight={search?.search as string}
              />
            ) : (
              <Link
                to={
                  primary && {
                    description: {
                      main: { key: primary },
                      [primary]: { db: sourceDatabase, accession },
                    },
                  }
                }
              >
                <HighlightedText
                  text={name}
                  textToHighlight={search?.search as string}
                />
              </Link>
            )}
          </>
        )}
      />
      <Column
        dataKey="source_organism"
        displayIf={primary === 'protein'}
        renderer={(sourceOrganism: SourceOrganism) =>
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
            String(sourceOrganism)
          )
        }
      >
        Species
      </Column>
      <Column
        dataKey="source_database"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        displayIf={
          primary !== 'taxonomy' &&
          primary !== 'proteome' &&
          primary !== 'protein'
        }
        renderer={(db: string) =>
          db === 'reviewed' ? (
            <Tooltip title="Reviewed by UniProtKB curators">
              <span
                className={css('icon', 'icon-common')}
                data-icon="&#xf2f0;"
                aria-label="reviewed"
              />
            </Tooltip>
          ) : (
            databases?.[db]?.name || db
          )
        }
      >
        {primary === 'protein' ? 'Reviewed' : 'Source database'}
      </Column>
      <Column
        dataKey="accession"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        defaultKey="structureAccession"
        displayIf={primary === 'structure'}
        renderer={(accession: string) => (
          <Link
            to={(customLocation) => ({
              ...customLocation,
              description: {
                main: { key: 'structure' },
                structure: {
                  db: customLocation.description.structure.db,
                  accession,
                },
              },
              search: {},
            })}
          >
            <LazyImage
              src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${accession}&file=traces.jpg`}
              alt={`structure with accession ${accession}`}
            />
          </Link>
        )}
      >
        Structure
      </Column>
      <Column dataKey="gene" displayIf={primary === 'protein'}>
        Gene
      </Column>
      <Column
        dataKey="in_alphafold"
        displayIf={primary === 'protein'}
        renderer={(
          inAlphafold: boolean,
          { accession, in_bfvd }: ProteinMetadata,
        ) =>
          inAlphafold ? (
            <Link
              to={{
                description: {
                  main: { key: 'protein' },
                  protein: { db: 'uniprot', accession, detail: 'alphafold' },
                },
              }}
            >
              AlphaFold
            </Link>
          ) : in_bfvd ? (
            <Link
              to={{
                description: {
                  main: { key: 'protein' },
                  protein: {
                    db: 'uniprot',
                    accession,
                    detail: 'bfvd',
                  },
                },
              }}
            >
              BFVD
            </Link>
          ) : null
        }
      >
        Predicted structure
      </Column>
      <Column
        dataKey="match"
        headerClassName={css('matchColumn')}
        displayIf={
          primary !== 'taxonomy' &&
          secondary !== 'taxonomy' &&
          primary !== 'proteome' &&
          secondary !== 'proteome' &&
          primary !== 'set' &&
          secondary !== 'set'
        }
        renderer={(
          match: GenericMatch,
          { matches }: { matches: Array<AnyMatch> },
        ) => (
          <Lazy>
            {(hasBeenVisible: boolean) =>
              hasBeenVisible ? (
                <MatchesByPrimary
                  {...props}
                  match={match}
                  innerMatches={matches}
                  primary={primary}
                  secondary={secondary}
                  isStale={isStale}
                  actualSize={actualSize}
                />
              ) : null
            }
          </Lazy>
        )}
      >
        Matches
      </Column>
      <Column
        dataKey="accession"
        defaultKey="proteinFastas"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        displayIf={primary === 'taxonomy' || primary === 'proteome'}
        renderer={(
          accession: string,
          row: {
            source_database: string;
            proteins?: number;
            counters?: { extra_fields: { counters: { proteins: number } } };
          },
        ) => {
          const count =
            row.proteins || row.counters?.extra_fields.counters.proteins || 0; // Extract count
          return ProteinDownloadRenderer(description)(accession, row, count); // Pass count
        }}
      >
        Proteins
      </Column>

      <Column
        dataKey="accession"
        defaultKey="seedAlignment"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        displayIf={
          primary === 'entry' &&
          secondary === 'set' &&
          description?.entry?.db === 'pfam'
        }
        renderer={(accession: string) => (
          <Link
            to={(customLocation) => ({
              description: {
                main: { key: 'entry' },
                entry: {
                  db: customLocation.description.set.db,
                  accession,
                  detail: 'entry_alignments',
                },
              },
              search: { type: 'seed' },
            })}
          >
            Link
          </Link>
        )}
      >
        Seed alignment
      </Column>
      <Column
        dataKey="accession"
        defaultKey="ida"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        displayIf={
          primary === 'entry' &&
          secondary === 'set' &&
          description?.entry?.db === 'pfam'
        }
        renderer={(accession: string) => (
          <Link
            to={(customLocation) => ({
              description: {
                main: { key: 'entry' },
                entry: {
                  db: customLocation.description.set.db,
                  accession,
                  detail: 'domain_architecture',
                },
              },
            })}
          >
            Link
          </Link>
        )}
      >
        Domain architectures
      </Column>
      <Column
        dataKey="matches"
        defaultKey="entryInMatch"
        headerClassName={css('table-center')}
        cellClassName={css('table-center')}
        displayIf={
          ['protein', 'structure'].includes(primary || '') &&
          secondary === 'set'
        }
        renderer={(matches: Array<AnyMatch>) => {
          const accessions = new Set(
            (matches || [])
              .map((match) => match.entry_accession)
              .filter(Boolean),
          ) as Set<string>;
          return Array.from(accessions).map((accession) => (
            <Link
              key={accession}
              to={(customLocation) => ({
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: customLocation.description.set.db,
                    accession,
                  },
                },
              })}
            >
              {accession.toUpperCase()}{' '}
            </Link>
          ));
        }}
      >
        Matching Entry
      </Column>
    </Table>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.hash,
  (state: GlobalState) => state,
  (search, description, hash, state) => ({ search, description, hash, state }),
);

export default connect(mapStateToProps)(Matches);
