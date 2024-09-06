// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import SpaceFiller from 'components/SimpleCommonComponents/SpaceFiller';
import Link from 'components/generic/Link';
// $FlowFixMe
import MemberDBSelector from 'components/MemberDBSelector';
// $FlowFixMe
import ProteinCard from 'components/Protein/Card';
// $FlowFixMe
import APIViewButton from 'components/Table/Exporter/APIViewButton';

// $FlowFixMe
import ProteinListFilters from 'components/Protein/ProteinListFilters';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
  // $FlowFixMe
} from 'components/Table';
// $FlowFixMe
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
// $FlowFixMe
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
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

const f = foundationPartial(
  fonts,
  pageStyle,
  ebiStyles,
  ipro,
  exporterStyle,
  filtersAndTable,
);

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

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
  /*::
    filterPanel: { current: null | React$ElementRef<'div'> };
  */
  constructor() {
    super();
    this.filterPanel = React.createRef();
  }

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { search, description },
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
      <div className={f('row', 'filters-and-table')}>
        <nav>
          <div className={f('browse-side-panel')} ref={this.filterPanel}>
            <div className={f('selector-container')}>
              <MemberDBSelector
                contentType="protein"
                className="pp-left-side-db-selector"
              />
            </div>
            <hr style={{ paddingTop: '0.5rem' }} />
            {!search.ida && <ProteinListFilters />}
          </div>
          <SpaceFiller
            element={this.filterPanel?.current}
            refresh={entryDB === null}
          />
        </nav>
        <section>
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
                  iconType="FASTA"
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
                <APIViewButton url={url} />
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
              cellClassName={'nowrap'}
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
                      <Tooltip title="Reviewed by UniProtKB curators">
                        <span
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf2f0;"
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
              dataKey="gene"
              renderer={(gene /*: string */) => (
                <span aria-label="gene">{gene}</span>
              )}
            >
              Gene
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
            <Column
              dataKey="in_alphafold"
              renderer={(inAlphafold, { accession }) =>
                inAlphafold ? (
                  <Link
                    to={{
                      description: {
                        main: { key: 'protein' },
                        protein: {
                          db: 'uniprot',
                          accession,
                          detail: 'alphafold',
                        },
                      },
                    }}
                  >
                    AlphaFold
                  </Link>
                ) : null
              }
            >
              Predicted structure
            </Column>{' '}
          </Table>
        </section>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
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

const childRoutesReg =
  /[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/i;

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
