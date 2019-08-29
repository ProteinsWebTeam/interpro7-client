/* eslint-disable react/display-name */
// @flow
import React, { PureComponent, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';
import File from 'components/File';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';

import loadable from 'higherOrder/loadable';

import { toPlural } from 'utils/pages';
import getColor from 'utils/taxonomy/get-color';
import getIcon from 'utils/taxonomy/get-icon';
import getNodeSpotlight from 'utils/taxonomy/get-node-spotlight';
import getSuperKingdom from 'utils/taxonomy/get-super-kingdom';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import subPages from 'subPages';
import config from 'config';

import EndPointPage from '../endpoint-page';
import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, pageStyle, styles, fonts);

const EntryAccessionsRenderer = entryDB => (taxId, _row, extra) => (
  <File
    fileType="accession"
    name={`${entryDB || 'all'}-entry-accessions-for-${taxId}.txt`}
    count={extra && extra.counters && extra.counters.entries}
    customLocationDescription={{
      main: { key: 'entry' },
      entry: { db: entryDB || 'all' },
      taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
    }}
  />
);

const ProteinFastasRenderer = entryDB => (taxId, _row, extra) => (
  <File
    fileType="fasta"
    name={`protein-sequences${
      entryDB ? `-matching-${entryDB}` : ''
    }-for-${taxId}.fasta`}
    count={extra && extra.counters && extra.counters.proteins}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      entry: { isFilter: true, db: entryDB || 'all' },
      taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
    }}
  />
);

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "taxonomy-summary" */ 'components/Taxonomy/Summary'
    ),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType,
  accessionSearch: T.shape({
    metadata: T.object,
  }),
};

const subPagesForTaxonomy = new Map();
for (const subPage of config.pages.taxonomy.subPages) {
  subPagesForTaxonomy.set(subPage, subPages.get(subPage));
}

export const SpeciesIcon = ({ lineage } /*: {lineage: string} */) => {
  let icon = '.';
  let color;
  if (lineage) {
    icon = getIcon(lineage) || '.';
    color = getColor(lineage);
  }
  return (
    <span
      style={{ color }}
      className={f('small', 'icon', 'icon-species')}
      data-icon={icon}
    />
  );
};
SpeciesIcon.propTypes = {
  lineage: T.string.isRequired,
};

/*:: type SummaryCounterOrgProps = {
  entryDB: string,
  metadata: Object,
  counters: Object
};*/
class SummaryCounterOrg extends PureComponent /*:: <SummaryCounterOrgProps> */ {
  static propTypes = {
    entryDB: T.string,
    metadata: T.object.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;

    const { entries, proteins, structures, proteomes } = counters;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${entries} ${entryDB || ''} ${toPlural(
            'entry',
            entries,
          )} matching ${metadata.name}`}
          className={f('count-entries')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: metadata.accession.toString(),
                },
                entry: { isFilter: true, db: entryDB && 'all' },
              },
            }}
            disabled={!entries}
          >
            <div className={f('icon-wrapper')}>
              <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />
              {entries !== 0 && (
                <div className={f('icon-over-anim', 'mod-img-pos')} />
              )}
            </div>
            <NumberComponent abbr>{entries}</NumberComponent>
            <span className={f('label-number')}>
              {toPlural('entry', entries)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteins}  ${toPlural('protein', proteins)} matching ${
            metadata.name
          }`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: metadata.accession.toString(),
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
            disabled={!proteins}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x50;"
            >
              {proteins !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{proteins}</NumberComponent>
            <span className={f('label-number')}>
              {' '}
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${structures} ${toPlural('structure', structures)} matching ${
            metadata.name
          }`}
          className={f('count-structures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: `${metadata.accession}`,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="&#x73;"
            >
              {structures !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{structures}</NumberComponent>{' '}
            <span className={f('label-number')}>structures</span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteomes} proteomes matching ${metadata.name}`}
          className={f('count-proteomes')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: `${metadata.accession}`,
                },
                proteome: { isFilter: true, db: 'uniprot' },
              },
            }}
            disabled={!proteomes}
          >
            <div
              className={f(
                'icon',
                'icon-common',
                'icon-count-proteome',
                'icon-wrapper',
              )}
            >
              {proteomes !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{proteomes}</NumberComponent>{' '}
            <span className={f('label-number')}>proteomes</span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}
const Lineage = ({ lineage } /*: {lineage: string} */) => {
  const superkingdom = getSuperKingdom(lineage) || 'N/A';
  const nodespot = getNodeSpotlight(lineage);
  return (
    <Tooltip title={`Lineage: ${lineage}`}>
      {superkingdom} {nodespot && `(${nodespot})`}
    </Tooltip>
  );
};
Lineage.propTypes = {
  lineage: T.string.isRequired,
};

const TaxonomyCard = (
  {
    data,
    search,
    entryDB,
  } /*: {data: Object, search: string, entryDB: string} */,
) => (
  <>
    <div className={f('card-header')}>
      <div className={f('card-image')}>
        {data.extra_fields && data.extra_fields.lineage && (
          <SpeciesIcon lineage={data.extra_fields.lineage} />
        )}
      </div>
      <div className={f('card-title')}>
        <h6>
          <Link
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: data.metadata.source_database,
                  accession: `${data.metadata.accession}`,
                },
              },
            }}
          >
            <HighlightedText
              text={data.metadata.name}
              textToHighlight={search}
            />
          </Link>
        </h6>
      </div>
    </div>

    <SummaryCounterOrg
      entryDB={entryDB}
      metadata={data.metadata}
      counters={data.extra_fields.counters}
    />

    <div className={f('card-footer')}>
      {data.extra_fields.lineage && (
        <Lineage lineage={data.extra_fields.lineage} />
      )}
      <div>
        Tax ID:{' '}
        <HighlightedText
          text={data.metadata.accession}
          textToHighlight={search}
        />
      </div>
    </div>
  </>
);
TaxonomyCard.propTypes = {
  data: T.object,
  search: T.string,
  entryDB: T.string,
};
/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
   ok: boolean,
   url: string,
   status: number
  },
  isStale: boolean,
  customLocation: {
    description: Object,
    search: Object
  },
  match: string,
  dataBase: {
   payload: Object,
   loading: boolean
  },
  accessionSearch: {
    metadata: Object,
  },

};*/
class List extends PureComponent /*:: <Props> */ {
  /*:: _payload: Object; */
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: {
        description: {
          entry: { db: entryDB },
        },
        search,
      },
      dataBase,
      accessionSearch,
    } = this.props;
    let _payload = payload;
    let _status = status;
    const HTTP_OK = 200;
    let notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (loading || notFound) {
      _payload = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    }
    const results = [...(_payload.results || [])];
    let size = _payload.count || 0;
    if (accessionSearch) {
      const indexInPayload = results.findIndex(
        ({ metadata: { accession } }) =>
          accession === accessionSearch.metadata.accession,
      );
      if (indexInPayload >= 0) {
        results.splice(indexInPayload, 1);
        size--;
      }

      results.splice(0, 1, {
        ...accessionSearch,
        exact: true,
        extra_fields: {
          counters: accessionSearch.metadata.counters,
        },
        metadata: {
          ...accessionSearch.metadata,
          name:
            accessionSearch.metadata.name.short ||
            accessionSearch.metadata.name.name ||
            accessionSearch.metadata.name,
        },
      });
      size++;
      notFound = false;
      _status = HTTP_OK;
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="taxonomy"
          className="pp-left-side-db-selector"
        />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          {/* <OrganismListFilters />*/}
          <hr className={f('margin-bottom-none')} />
          {databases && (
            <SchemaOrgData
              data={{
                data: { db: databases.uniprot },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}
          <Table
            dataTable={results}
            contentType="taxonomy"
            loading={loading}
            ok={ok}
            status={_status}
            isStale={isStale}
            actualSize={size}
            query={search}
            notFound={notFound}
            withTree={true}
            withGrid={true}
            databases={databases}
            nextAPICall={_payload.next}
            previousAPICall={_payload.previous}
            currentAPICall={url}
          >
            <Exporter>
              <ul>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=json`}
                    download="taxonomy.json"
                  >
                    JSON
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                    download="taxonomy.tsv"
                  >
                    TSV
                  </Link>
                </li>
                <li>
                  <Link target="_blank" href={url}>
                    Open in API web view
                  </Link>
                </li>
              </ul>
            </Exporter>
            <PageSizeSelector />
            <Card>
              {data => (
                <TaxonomyCard
                  data={data}
                  search={search.search}
                  entryDB={entryDB}
                />
              )}
            </Card>
            <SearchBox loading={isStale}>Search taxonomy</SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <Link
                  to={customLocation => ({
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        ...customLocation.description.taxonomy,
                        accession: accession.toString(),
                      },
                    },
                  })}
                >
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'taxonomy' },
                      location: window.location,
                    }}
                    processData={schemaProcessDataTableRow}
                  />
                  <HighlightedText
                    text={accession}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Accession
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={customLocation => ({
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        ...customLocation.description.taxonomy,
                        accession: accession.toString(),
                      },
                    },
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Name
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entry-count"
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.entries) || '-';
                return (
                  <Link
                    className={f('no-decoration')}
                    to={{
                      description: {
                        main: { key: 'taxonomy' },
                        taxonomy: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        entry: { isFilter: true, db: entryDB || 'all' },
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
                );
              }}
            >
              Entry count
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entryAccessions"
              renderer={EntryAccessionsRenderer(entryDB)}
            >
              Entry accessions
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="protein-count"
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.proteins) || '-';
                return (
                  <Link
                    to={{
                      description: {
                        main: { key: 'taxonomy' },
                        taxonomy: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        protein: { isFilter: true, db: 'UniProt', order: 1 },
                        entry: entryDB
                          ? { isFilter: true, db: entryDB, order: 2 }
                          : null,
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
                );
              }}
            >
              <Tooltip title="All the proteins for this taxonomy containing an entry from the selected database">
                Protein count
              </Tooltip>
            </Column>
            <Column
              dataKey="accession"
              defaultKey="proteinFastas"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={ProteinFastasRenderer(entryDB)}
            >
              FASTA
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}
const childRoutes = /(\d+)|(all)/i;

const _AccessionSearch = ({ data, onSearchComplete }) => {
  onSearchComplete(data && !data.loading && data.payload);
  return null;
};

const getURLFromState = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, { search }) => {
    const desc = {
      ...description,
      taxonomy: {
        db: 'uniprot',
        accession: search,
      },
    };
    try {
      return format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(desc),
      });
    } catch {
      return;
    }
  },
);
const AccessionSearch = loadData(getURLFromState)(_AccessionSearch);
const Taxonomy = ({ search }) => {
  const [accSearch, setAccSearch] = useState(null);
  const searchTerm = search && search.search;
  return (
    <>
      {searchTerm && <AccessionSearch onSearchComplete={setAccSearch} />}
      <EndPointPage
        subpagesRoutes={childRoutes}
        listOfEndpointEntities={List}
        SummaryAsync={SummaryAsync}
        subPagesForEndpoint={subPagesForTaxonomy}
        accessionSearch={searchTerm && accSearch}
      />
    </>
  );
};
Taxonomy.propTypes = {
  search: T.shape({
    search: T.string,
  }),
};

const mapStateToProps = createSelector(
  state => state.customLocation.search,
  search => ({ search }),
);

export default connect(mapStateToProps)(Taxonomy);
