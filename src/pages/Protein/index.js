// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import {
  dataPropType,
  metadataPropType,
} from 'higherOrder/loadData/dataPropTypes';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';

import ProteinListFilters from 'components/Protein/ProteinListFilters';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';
import NumberComponent from 'components/NumberComponent';
import File from 'components/File';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForApi } from 'higherOrder/loadData/defaults';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import exporterStyle from 'components/Table/Exporter/style.css';

const f = foundationPartial(fonts, pageStyle, ebiStyles, ipro, exporterStyle);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';
import { toPlural } from 'utils/pages';

/*:: type Props = {
  metadata: Object,
  counters: Object,
  entryDB: string
};*/

class SummaryCounterProteins extends PureComponent /*:: <Props> */ {
  static propTypes = {
    metadata: metadataPropType.isRequired,
    counters: T.object.isRequired,
    entryDB: T.string.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;
    const { entries, structures } = counters;

    return (
      <div className={f('card-block', 'card-counter', 'label-off')}>
        <Tooltip
          title={`${entries} ${entryDB} ${toPlural(
            'entry',
            entries,
          )} matching ${metadata.name}`}
          className={f('count-entries')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'protein' },
                protein: {
                  db: 'uniprot',
                  accession: metadata.accession,
                },
                entry: { isFilter: true, db: entryDB || 'all' },
              },
            }}
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
          title={`${structures} ${toPlural('structure', structures)} matching ${
            metadata.name
          }`}
          className={f('count-structures')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'protein' },
                protein: {
                  db: 'uniprot',
                  accession: metadata.accession,
                },
                structure: { isFilter: true, db: 'PDB' },
              },
            }}
            disabled={!structures}
          >
            <div
              className={f('icon', 'icon-conceptual', 'icon-wrapper')}
              data-icon="s"
            >
              {structures !== 0 && <div className={f('icon-over-anim')} />}
            </div>
            <NumberComponent abbr>{structures}</NumberComponent>
            <span className={f('label-number')}>
              {toPlural('structure', structures)}
            </span>
          </Link>
        </Tooltip>
      </div>
    );
  }
}

const ProteinCard = (
  {
    data,
    search,
    entryDB,
  } /*: {data: Object, search: string, entryDB: string} */,
) => (
  <>
    <div className={f('card-header')}>
      <div className={f('card-title')}>
        {data.metadata.source_database === 'reviewed' ? (
          <>
            <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
              <span
                className={f('icon', 'icon-common')}
                data-icon="&#xf00c;"
                aria-label="reviewed"
              />
            </Tooltip>
          </>
        ) : null}
        <h6>
          <Link
            to={{
              description: {
                main: { key: 'protein' },
                protein: {
                  db: data.metadata.source_database,
                  accession: data.metadata.accession,
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

    <div className={f('card-subheader')}>{data.metadata.length} AA</div>

    {data.extra_fields ? (
      <SummaryCounterProteins
        metadata={data.metadata}
        counters={data.extra_fields.counters}
        entryDB={entryDB}
      />
    ) : (
      <Loading />
    )}

    <div className={f('card-footer')}>
      <Tooltip
        title={`${data.metadata.source_organism.fullName} (Tax ID: ${data.metadata.source_organism.taxId})`}
      >
        {data.metadata.source_organism.fullName}
      </Tooltip>
      <div>
        <HighlightedText
          text={data.metadata.accession || ''}
          textToHighlight={search}
        />
      </div>
    </div>
  </>
);
ProteinCard.propTypes = {
  data: dataPropType.object,
  search: T.string,
  entryDB: T.string,
};

const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType.isRequired,
};

const AllProteinDownload = (
  {
    description,
    count,
    fileType,
    search,
  } /*: {description: Object, search: Object, count: number, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`protein-sequences.${fileType}`}
    count={count}
    customLocationDescription={description}
    endpoint="protein"
    search={search}
  />
);
AllProteinDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
};

/*:: type ListProps = {
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
  }
};*/

class List extends PureComponent /*:: <ListProps> */ {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search, description },
      // customLocation: { description: { protein: { db } }, search },
      dataBase,
    } = this.props;
    const {
      entry: { db: entryDB },
    } = description;
    let _payload = payload;
    const HTTP_OK = 200;
    const notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    const db = 'uniprot';
    if (loading || notFound) {
      _payload = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    }
    return (
      <div className={f('row')}>
        <div
          className={f(
            'columns',
            'small-12',
            'medium-3',
            'large-2',
            'no-padding',
          )}
        >
          <div className={f('browse-side-panel')}>
            <div className={f('selector-container')}>
              <MemberDBSelector
                contentType="protein"
                className="pp-left-side-db-selector"
              />
            </div>
            <hr style={{ paddingTop: '0.5rem' }} />
            {!search.ida && <ProteinListFilters />}
          </div>
        </div>
        <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
          {databases && db && databases[db.toLowerCase()] && (
            <SchemaOrgData
              data={{
                data: { db: databases[db.toLowerCase()] },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}
          <Table
            dataTable={_payload.results}
            contentType="protein"
            isStale={isStale}
            loading={loading}
            ok={ok}
            status={status}
            actualSize={_payload.count}
            query={search}
            notFound={notFound}
            databases={databases}
            nextAPICall={_payload.next}
            previousAPICall={_payload.previous}
            currentAPICall={url}
          >
            <Exporter>
              <div className={f('menu-grid')}>
                <label htmlFor="fasta">FASTA</label>
                <AllProteinDownload
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="fasta"
                  name="fasta"
                />
                <label htmlFor="json">JSON</label>
                <AllProteinDownload
                  name="json"
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="json"
                />
                <label htmlFor="tsv">TSV</label>
                <AllProteinDownload
                  name="tsv"
                  description={description}
                  search={search}
                  count={_payload.count}
                  fileType="tsv"
                />
                <label htmlFor="api">API</label>
                <Link
                  name="api"
                  target="_blank"
                  href={url}
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
            <Card>
              {(data) => (
                <ProteinCard
                  data={data}
                  search={search.search}
                  entryDB={entryDB}
                />
              )}
            </Card>
            <PageSizeSelector />
            <SearchBox loading={isStale}>Search proteins</SearchBox>
            <HighlightToggler />
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <>
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'protein' },
                      location: window.location,
                    }}
                    processData={schemaProcessDataTableRow}
                  />
                  <Link
                    to={(customLocation) => ({
                      ...customLocation,
                      description: {
                        main: { key: 'protein' },
                        protein: {
                          db: customLocation.description.protein.db,
                          accession,
                        },
                      },
                      search: {},
                    })}
                    className={f('acc-row')}
                  >
                    <HighlightedText
                      text={accession || ''}
                      textToHighlight={search.search}
                    />
                  </Link>
                  {row.source_database === 'reviewed' ? (
                    <>
                      {'\u00A0' /* non-breakable space */}
                      <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                        <span
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf00c;"
                          aria-label="reviewed"
                        />
                      </Tooltip>
                    </>
                  ) : null}
                </>
              )}
            />

            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={(customLocation) => ({
                    ...customLocation,
                    description: {
                      main: { key: 'protein' },
                      protein: {
                        db: customLocation.description.protein.db,
                        accession,
                      },
                    },
                    search: {},
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
              dataKey="source_organism"
              renderer={({ fullName, taxId }) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        db: 'uniprot',
                        accession: `${taxId}`,
                      },
                    },
                  }}
                >
                  {fullName}
                </Link>
              )}
            >
              Species
            </Column>
            <Column
              dataKey="length"
              headerClassName={f('text-right')}
              cellClassName={f('text-right')}
              renderer={(length /*: number */) => (
                <Tooltip title={`${length.toLocaleString()} amino acids`}>
                  <span aria-label="amino acids length">
                    {length.toLocaleString()}
                  </span>
                </Tooltip>
              )}
            >
              Length
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "protein-summary" */ 'components/Protein/Summary'
    ),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const subPagesForProtein = new Map();
for (const subPage of config.pages.protein.subPages) {
  subPagesForProtein.set(subPage, subPages.get(subPage));
}

const childRoutesReg = /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;

const Protein = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForProtein}
  />
);

export default loadData((...args) =>
  getUrlForApi(...args)
    .replace('/domain_architecture', '/entry')
    .replace('/sequence', '/'),
)(Protein);
