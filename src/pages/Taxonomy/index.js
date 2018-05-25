import React, { PureComponent } from 'react';
import T from 'prop-types';

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
import ProteinFile from 'subPages/Organism/ProteinFile';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import { NumberComponent } from 'components/NumberLabel';

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

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(pageStyle, styles, fonts);

const EntryAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="entry-accession" />
);

const ProteinAccessionsRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="protein-accession" />
);

const ProteinFastasRenderer = taxId => (
  <ProteinFile taxId={`${taxId}`} type="FASTA" />
);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "taxonomy-summary" */ 'components/Taxonomy/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }).isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
    ok: T.bool,
  }),
};

const subPagesForTaxonomy = new Map();
for (const subPage of config.pages.taxonomy.subPages) {
  subPagesForTaxonomy.set(subPage, subPages.get(subPage));
}

const SpeciesIcon = ({ lineage }) => {
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
class SummaryCounterOrg extends PureComponent {
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
            <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />
            <NumberComponent value={entries} abbr scaleMargin={1} />
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
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x50;" />{' '}
            <NumberComponent value={proteins} abbr scaleMargin={1} />
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
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x73;" />{' '}
            <NumberComponent value={structures} abbr scaleMargin={1} />{' '}
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
            <div className={f('icon', 'icon-common', 'icon-count-proteome')} />
            <NumberComponent value={proteomes} abbr scaleMargin={1} />{' '}
            <span className={f('label-number')}>proteomes</span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}
const Lineage = ({ lineage }) => {
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

const TaxonomyCard = ({ data, search, entryDB }) => (
  <React.Fragment>
    <div className={f('card-header')}>
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
        <SpeciesIcon lineage={data.extra_fields.lineage} />
        <h6>
          <HighlightedText text={data.metadata.name} textToHighlight={search} />
        </h6>
      </Link>
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
        Tax ID:
        <HighlightedText
          text={data.metadata.accession}
          textToHighlight={search}
        />
      </div>
    </div>
  </React.Fragment>
);
TaxonomyCard.propTypes = {
  data: T.object,
  search: T.string,
  entryDB: T.string,
};

class List extends PureComponent {
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
    } = this.props;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (loading || notFound) {
      _payload = {
        results: [],
      };
    }
    const urlHasParameter = url && url.includes('?');
    return (
      <div className={f('row')}>
        <MemberDBSelector
          contentType="taxonomy"
          className="left-side-db-selector"
        />
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          {/*<OrganismListFilters />*/}
          <hr />
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
            dataTable={_payload.results}
            contentType="taxonomy"
            loading={loading}
            ok={ok}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            withTree={true}
            withGrid={true}
          >
            <Exporter>
              <ul>
                <li>
                  <Link href={url} download="taxonomy.json">
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
            <SearchBox search={search.search}>Search taxonomy</SearchBox>
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
                    <NumberComponent value={count} loading={loading} abbr />
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
              renderer={EntryAccessionsRenderer}
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
                        protein: { isFilter: true, db: 'UniProt' },
                      },
                    }}
                  >
                    <NumberComponent value={count} loading={loading} abbr />
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
              renderer={ProteinFastasRenderer}
            >
              FASTA
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="proteinAccessions"
              renderer={ProteinAccessionsRenderer}
            >
              Protein accessions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}
const childRoutes = /(\d+)|(all)/i;

const Taxonomy = () => (
  <EndPointPage
    subpagesRoutes={childRoutes}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForTaxonomy}
  />
);

export default Taxonomy;
