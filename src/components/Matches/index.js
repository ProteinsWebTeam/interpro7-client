// @flow
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import { toPlural } from 'utils/pages';
import loadable from 'higherOrder/loadable';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import config from 'config';

import EntriesOnProtein from './EntriesOnProtein';
import EntriesOnStructure from './EntriesOnStructure';
import StructureOnProtein from './StructureOnProtein';
import FileExporter from './FileExporter';
import File from 'components/File';

import Table, {
  Column,
  PageSizeSelector,
  SearchBox,
  Exporter,
  HighlightToggler,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';
import Lazy from 'wrappers/Lazy';
import LazyImage from 'components/LazyImage';
import loadWebComponent from 'utils/load-web-component';
import { toPublicAPI } from 'utils/url';

import {
  getReversedUrl,
  includeTaxonFocusedOnURL,
} from 'higherOrder/loadData/defaults';

import { searchSelector } from 'reducers/custom-location/search';
import { descriptionSelector } from 'reducers/custom-location/description';
import { hashSelector } from 'reducers/custom-location/hash';

import { foundationPartial } from 'styles/foundation';
import { endpoint2type } from 'schema_org/processors';

import localStyle from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const f = foundationPartial(fonts, localStyle, exporterStyle);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemamap = {
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

const schemaProcessData = (
  { data, primary, secondary } /*: {
    data: {
      accession: string,
      source_database: string,
      name: string,
    },
    primary: string,
    secondary: string
  }*/,
) => {
  const name = schemamap[secondary][primary];
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

const propTypes = {
  matches: T.arrayOf(T.object).isRequired,
  primary: T.string.isRequired,
  secondary: T.string.isRequired,
  isStale: T.bool,
  options: T.shape({
    baseSize: T.number,
    offset: T.number,
    niceRatio: T.number,
  }),
  actualSize: T.number,
};

const componentMatch = {
  protein: {
    entry: EntriesOnProtein,
    structure: StructureOnProtein,
  },
  entry: {
    protein: EntriesOnProtein,
    structure: EntriesOnStructure,
  },
  structure: {
    entry: EntriesOnStructure,
    protein: StructureOnProtein,
  },
};

// List of all matches for one `primary`, one to many
const MatchesByPrimary = (
  { matches, primary, secondary, ...props } /*: {
  matches: Array<Object>,
  primary: string,
  secondary: string,
  props: Array<any>,
} */,
) => {
  const MatchComponent = componentMatch[primary][secondary];
  return <MatchComponent {...props} matches={matches} />;
};
MatchesByPrimary.propTypes = propTypes;

export const ProteinDownloadRenderer =
  (
    description /*: {
  main: {key:string, ...},
  taxonomy: {accession: string, isFilter: boolean},
} */,
  ) =>
  (accession, row) => {
    const endpointToFilterBy /*: string */ = description.taxonomy.isFilter
      ? 'taxonomy'
      : 'proteome';
    return (
      <div className={f('actions')}>
        <Tooltip title="View matching proteins" useContext>
          <div className={f('view-icon-div')}>
            <Link
              className={f('icon', 'icon-conceptual', 'view-link')}
              to={{
                description: {
                  main: { key: description.main.key },
                  [description.main.key]: {
                    ...description[description.main.key],
                  },
                  protein: {
                    db: 'uniprot',
                    order: 1,
                    isFilter: true,
                  },
                  [endpointToFilterBy]: {
                    accession: accession,
                    db: row.source_database,
                    order: 2,
                    isFilter: true,
                  },
                },
              }}
              aria-label="View proteins"
              data-icon="&#x50;"
            />
          </div>
        </Tooltip>
        <File
          fileType="fasta"
          name={`protein-sequences-matching-${
            description[description.main.key].accession
          }-for-${accession}.fasta`}
          count={row.proteins || row.counters.extra_fields.counters.proteins}
          customLocationDescription={{
            main: { key: 'protein' },
            protein: { db: 'UniProt' },
            [endpointToFilterBy]: {
              isFilter: true,
              db: 'UniProt',
              accession: `${accession}`,
            },
            [description.main.key]: {
              ...description[description.main.key],
              isFilter: true,
            },
          }}
          showIcon={true}
        />
        <Tooltip title={`View ${endpointToFilterBy} information`}>
          <Link
            to={{
              description: {
                main: {
                  key: endpointToFilterBy,
                },
                [endpointToFilterBy]: {
                  db: row.source_database,
                  accession: accession,
                },
              },
            }}
          >
            <div
              className={f('icon', 'icon-count-organisms', 'icon-wrapper')}
            />
          </Link>
        </Tooltip>
      </div>
    );
  };

const includeAccessionSearch = (
  dataTable,
  accessionSearch,
  primary,
  secondary,
  mainData,
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
        ...accessionSearch[toPlural(secondary)][0],
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
// List of all matches, many to many
// eslint-disable-next-line complexity
const Matches = (
  {
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
  } /*: {
    matches: Array<Object>,
    primary: string,
    secondary: string,
    actualSize: number,
    isStale: boolean,
    search: Object,
    description: Object,
    hash?: string,
    state: Object,
    databases: Object,
    dbCounters ?: Object,
    mainData: Object,
    accessionSearch: Object,
    focusType?: string,
    currentAPICall: string,
    nextAPICall: string,
    previousAPICall: string,
    status: number,
    props: Array<any>
} */,
) => {
  const [focused, setFocused] = useState(null);
  useEffect(() => {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }, []);

  let aggSize = actualSize;
  const dataTable = matches.map((e) => ({
    ...e[primary],
    accession: String(e[primary].accession),
    match: e,
  }));
  if (accessionSearch) {
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
      rowClassName={(row) => f({ exact: row.exact })}
      nextAPICall={nextAPICall}
      previousAPICall={previousAPICall}
      currentAPICall={currentAPICall}
      status={status}
      onFocusChanged={setFocused}
    >
      <PageSizeSelector />
      {!(isTaxonomySubpage && ['sunburst', 'keyspecies'].includes(hash)) && (
        <SearchBox loading={isStale} />
      )}
      <HighlightToggler />
      {description.main.key !== 'result' &&
        !(isTaxonomySubpage && ['sunburst', 'keyspecies'].includes(hash)) && (
          <Exporter>
            <div className={f('menu-grid')}>
              {primary === 'protein' && (
                <>
                  <label htmlFor="fasta">FASTA</label>
                  <FileExporter
                    description={description}
                    count={actualSize}
                    search={search}
                    name="fasta"
                    fileType="fasta"
                    primary={primary}
                    secondary={secondary}
                    focused={focused}
                  />
                </>
              )}
              <label htmlFor="tsv">TSV</label>
              <FileExporter
                name="tsv"
                description={description}
                count={actualSize}
                search={search}
                fileType="tsv"
                primary={primary}
                secondary={secondary}
                focused={focused}
              />
              <label htmlFor="json">JSON</label>
              <FileExporter
                name="json"
                description={description}
                count={actualSize}
                search={search}
                fileType="json"
                primary={primary}
                secondary={secondary}
                focused={focused}
              />
              <label htmlFor="api">API</label>
              <Link
                name="api"
                target="_blank"
                href={toPublicAPI(
                  includeTaxonFocusedOnURL(getReversedUrl(state), focused),
                )}
                className={f('button', 'hollow', 'imitate-progress-button')}
              >
                <span
                  className={f('icon', 'icon-common', 'icon-export')}
                  data-icon="&#xf233;"
                />
                <span className={f('file-label')}>Web View</span>
              </Link>
            </div>
          </Exporter>
        )}
      <Column
        dataKey="accession"
        renderer={(
          acc /*: string */,
          obj /*: {source_database: string, type: string} */,
        ) => {
          const { source_database: sourceDatabase } = obj;
          const cellContent = (
            <span className={f('acc-row')}>
              {obj.source_database === 'interpro' ? (
                <interpro-type
                  type={obj.type.replace('_', ' ')}
                  dimension=".8em"
                />
              ) : null}
              <HighlightedText text={acc} textToHighlight={search.search} />
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
                  to={{
                    description: {
                      main: { key: primary },
                      [primary]: { db: sourceDatabase, accession: acc },
                    },
                  }}
                >
                  {cellContent}
                </Link>
              )}
              {primary === 'protein' && sourceDatabase === 'reviewed' ? (
                <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf00c;"
                    aria-label="reviewed"
                  />
                </Tooltip>
              ) : null}
            </>
          );
        }}
      >
        {focusType === 'taxonomy' ? 'Tax ID' : 'Accession'}
      </Column>
      <Column
        dataKey="name"
        renderer={(
          name /*: string */,
          {
            accession,
            source_database: sourceDatabase,
          } /*: {accession: string, source_database: string} */,
        ) => (
          <>
            {focusType === 'taxonomy' || focusType === 'proteome' ? (
              <HighlightedText text={name} textToHighlight={search.search} />
            ) : (
              <Link
                to={{
                  description: {
                    main: { key: primary },
                    [primary]: { db: sourceDatabase, accession },
                  },
                }}
              >
                <HighlightedText text={name} textToHighlight={search.search} />
              </Link>
            )}
          </>
        )}
      />
      <Column
        dataKey="source_organism"
        displayIf={primary === 'protein'}
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
        Species
      </Column>
      <Column
        dataKey="source_database"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        displayIf={
          primary !== 'taxonomy' &&
          primary !== 'proteome' &&
          primary !== 'protein'
        }
        renderer={(db /*: string */) =>
          db === 'reviewed' ? (
            <Tooltip
              title={
                db === 'reviewed'
                  ? `${db} by curators (Swiss-Prot)`
                  : 'Not reviewed by curators (TrEMBL)'
              }
            >
              <span
                className={f('icon', 'icon-common')}
                data-icon="&#xf00c;"
                aria-label="reviewed"
              />
            </Tooltip>
          ) : (
            (databases && databases[db] && databases[db].name) || db
          )
        }
      >
        {primary === 'protein' ? 'Reviewed' : 'Source database'}
      </Column>
      <Column
        dataKey="accession"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        defaultKey="structureAccession"
        displayIf={primary === 'structure'}
        renderer={(accession /*: string */) => (
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
              src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${accession}/traces.jpg`}
              alt={`structure with accession ${accession}`}
              style={{ maxWidth: '33%' }}
            />
          </Link>
        )}
      >
        Structure
      </Column>
      <Column
        dataKey="match"
        headerClassName={f('matchColumn')}
        displayIf={
          primary !== 'taxonomy' &&
          secondary !== 'taxonomy' &&
          primary !== 'proteome' &&
          secondary !== 'proteome' &&
          primary !== 'set' &&
          secondary !== 'set'
        }
        renderer={(match /*: Object */) => (
          <Lazy>
            {(hasBeenVisible /*: boolean */) =>
              hasBeenVisible ? (
                <MatchesByPrimary
                  {...props}
                  matches={[match]}
                  primary={primary}
                  secondary={secondary}
                />
              ) : null
            }
          </Lazy>
        )}
      >
        Matches
      </Column>
      <Column
        dataKey="counters.extra_fields.counters.proteins"
        defaultKey="protein-count"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        displayIf={primary === 'taxonomy' || primary === 'proteome'}
        renderer={(count) => <NumberComponent abbr>{count}</NumberComponent>}
      >
        protein count
      </Column>
      <Column
        dataKey="accession"
        defaultKey="proteinFastas"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        displayIf={primary === 'taxonomy' || primary === 'proteome'}
        renderer={ProteinDownloadRenderer(description)}
      >
        Actions
      </Column>
      <Column
        dataKey="accession"
        defaultKey="seedAlignment"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        displayIf={
          primary === 'entry' &&
          secondary === 'set' &&
          description?.entry?.db === 'pfam'
        }
        renderer={(accession /*: string */) => (
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
            Seed Aligment
          </Link>
        )}
      >
        Seed alignment
      </Column>
      <Column
        dataKey="accession"
        defaultKey="ida"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        displayIf={
          primary === 'entry' &&
          secondary === 'set' &&
          description?.entry?.db === 'pfam'
        }
        renderer={(accession /*: string */) => (
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
    </Table>
  );
};
Matches.propTypes = {
  ...propTypes,
  search: T.object.isRequired,
  description: T.object.isRequired,
  state: T.object.isRequired,
  databases: T.object.isRequired,
  dbCounters: T.object,
};

const mapStateToProps = createSelector(
  searchSelector,
  descriptionSelector,
  hashSelector,
  (state) => state,
  (search, description, hash, state) => ({ search, description, hash, state }),
);

export default connect(mapStateToProps)(Matches);
