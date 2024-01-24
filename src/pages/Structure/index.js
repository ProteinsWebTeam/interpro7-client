// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
// $FlowFixMe
import MemberSymbol from 'components/Entry/MemberSymbol';
import LazyImage from 'components/LazyImage';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import { Card as NewCard } from 'components/SimpleCommonComponents/Card';
import StructureListFilters from 'components/Structure/StructureListFilters';
// $FlowFixMe
import SummaryCounterStructures from 'components/Structure/SummaryCounterStructures';
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
// $FlowFixMe
import File from 'components/File';

import { toPlural } from 'utils/pages';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import EndPointPage from '../endpoint-page';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import pageStyle from '../style.css';
// $FlowFixMe
import { formatExperimentType } from 'components/Structure/utils';
import exporterStyle from 'components/Table/Exporter/style.css';
import theme from 'styles/theme-interpro.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

const f = foundationPartial(
  ebiGlobalStyles,
  pageStyle,
  fonts,
  exporterStyle,
  theme,
  filtersAndTable,
);

const SummaryAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "structure-summary" */ 'components/Structure/Summary'
    ),
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
    url: T.string,
    status: T.number,
  }).isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }),
};

const Overview = (
  {
    data: { payload, loading },
  } /*: {data: {payload: Object, loading: boolean}} */,
) => {
  if (loading) return <Loading />;
  return (
    <ul className={f('card')}>
      {Object.entries(payload.structures || {}).map(([name, count]) => (
        <li key={name}>
          <Link
            to={{
              description: {
                main: { key: 'structure' },
                structure: { db: name },
              },
            }}
          >
            {name} ({count})
          </Link>
        </li>
      ))}
    </ul>
  );
};
Overview.propTypes = propTypes;

/*:: type TaxnameStructuresProps = {
  data: {
    loading: boolean,
    payload: Object
  }
};*/
class TaxnameStructures extends PureComponent /*:: <TaxnameStructuresProps> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool,
      payload: T.shape({
        results: T.arrayOf(
          T.shape({
            metadata: T.object,
          }),
        ),
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { loading, payload },
    } = this.props;

    return (
      // TODO: get values when more than 2 species
      <Tooltip
        title={`${loading ? '' : payload.results[0].metadata.name} (Tax ID: ${
          loading ? '' : payload.results[0].metadata.accession
        })`}
      >
        {loading || payload.results[0].metadata.name}
      </Tooltip>
    );
  }
}

const getUrlForStructTaxname = (accession) =>
  createSelector(
    (state) => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'taxonomy' },
            taxonomy: { db: 'uniprot' },
            structure: {
              isFilter: true,
              db: 'pdb',
              accession: accession,
            },
          }),
      }),
  );
/*:: type StructureCardProps = {
  data: Object,
  search: string,
  entryDB: string
};*/

/*:: type StructureCardState = {
  TaxnameStructuresWithData: function,
  accession: string
};*/
class StructureCard extends PureComponent /*:: <StructureCardProps, StructureCardState> */ {
  static propTypes = {
    data: T.object,
    search: T.string,
    entryDB: T.string,
  };

  constructor(props /*: StructureCardProps */) {
    super(props);

    const accession = props.data.metadata.accession;
    this.state = {
      TaxnameStructuresWithData: loadData(getUrlForStructTaxname(accession))(
        TaxnameStructures,
      ),
      accession,
    };
  }

  static getDerivedStateFromProps(
    nextProps /*: StructureCardProps */,
    prevState /*: StructureCardState */,
  ) {
    const nextAccession = nextProps.data.metadata.accession;

    if (nextAccession === prevState.accession) return null;

    return {
      TaxnameStructuresWithData: loadData(
        getUrlForStructTaxname(nextAccession),
      )(TaxnameStructures),
      accession: nextAccession,
    };
  }

  render() {
    const { data, search, entryDB } = this.props;
    const { TaxnameStructuresWithData } = this.state;
    return (
      <NewCard
        title={
          <Link
            to={{
              description: {
                main: { key: 'structure' },
                structure: {
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
        }
        imageComponent={
          <Tooltip
            title={`3D visualisation for ${data.metadata.accession} structure`}
          >
            <LazyImage
              src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${data.metadata.accession}&file=traces.jpg`}
              alt={`structure with accession ${data.metadata.accession}`}
            />
          </Tooltip>
        }
        subHeader={
          <>
            {
              // INFO RESOLUTION BL - browse structures - Xray
              data.metadata.experiment_type === 'x-ray' && (
                <Tooltip
                  title={`X-ray, resolution ${data.metadata.resolution} Å`}
                >
                  {data.metadata.experiment_type}
                  {': '}
                  {data.metadata.resolution}Å
                </Tooltip>
              )
            }
            {
              // INFO TYPE BL - browse structures -NMR
              data.metadata.experiment_type === 'nmr' && (
                <Tooltip title="Nuclear Magnetic Resonance">
                  {data.metadata.experiment_type}
                </Tooltip>
              )
            }
          </>
        }
        footer={
          <>
            <TaxnameStructuresWithData />
            <div>
              <HighlightedText
                text={data.metadata.accession || ''}
                textToHighlight={search}
              />
            </div>
          </>
        }
      >
        {data.extra_fields && data.metadata && data.extra_fields.counters && (
          <SummaryCounterStructures
            structureName={data.metadata.name}
            structureAccession={data.metadata.accession}
            entryDB={entryDB}
            counters={data.extra_fields.counters}
          />
        )}
      </NewCard>
    );
  }
}
const AllStructuresDownload = (
  {
    description,
    search,
    count,
    fileType,
  } /*: {description: Object, search: Object,count: number, fileType: string} */,
) => (
  <File
    fileType={fileType}
    name={`structures.${fileType}`}
    count={count}
    customLocationDescription={description}
    search={search}
    endpoint={'structure'}
  />
);
AllStructuresDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
};

const List = (
  {
    data: { payload, loading, ok, url, status },
    isStale,
    customLocation: { description, search },
    dataBase,
  } /*: { data: {
   payload: {
      results: Array<Object>,
      count: number,
      next: ?string,
      previous: ?string,
   },
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
  dataBase: {
   payload: Object,
   loading: boolean
  }} */,
) => {
  let _payload = payload;
  const {
    entry: { db: entryDB },
    structure: { db },
  } = description;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  const databases = dataBase && dataBase.payload && dataBase.payload.databases;
  if (loading || notFound) {
    _payload = {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
  }
  const includeGrid = url;
  return (
    <div className={f('row', 'filters-and-table')}>
      <nav>
        <div className={f('browse-side-panel')}>
          <div className={f('selector-container')}>
            <MemberDBSelector
              contentType="structure"
              className="pp-left-side-db-selector"
            />
          </div>
          <hr style={{ paddingTop: '0.5rem' }} />
          <StructureListFilters />
        </div>
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
          contentType="structure"
          loading={loading}
          ok={ok}
          status={status}
          isStale={isStale}
          actualSize={_payload.count}
          query={search}
          notFound={notFound}
          withGrid={!!includeGrid}
          databases={databases}
          nextAPICall={_payload.next}
          previousAPICall={_payload.previous}
          currentAPICall={url}
        >
          <Exporter>
            <div className={f('menu-grid')}>
              <label htmlFor="json">JSON</label>
              <AllStructuresDownload
                name="json"
                description={description}
                search={search}
                count={_payload.count}
                fileType="json"
              />
              <label htmlFor="tsv">TSV</label>
              <AllStructuresDownload
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
          <PageSizeSelector />
          <Card>
            {(data) => (
              <StructureCard
                data={data}
                search={search.search}
                entryDB={entryDB}
              />
            )}
          </Card>
          <SearchBox loading={isStale}>Search structures</SearchBox>
          <HighlightToggler />
          <Column
            dataKey="accession"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            renderer={(accession /*: string */, row) => (
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
                <SchemaOrgData
                  data={{
                    data: { row, endpoint: 'structure' },
                    location: window.location,
                  }}
                  processData={schemaProcessDataTableRow}
                />
                <HighlightedText
                  text={accession || ''}
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
                <HighlightedText
                  text={name.toUpperCase()}
                  textToHighlight={search.search}
                />
              </Link>
            )}
          >
            Name
          </Column>
          <Column
            dataKey="experiment_type"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            renderer={(type) => formatExperimentType(type)}
          >
            Experiment type
          </Column>
          <Column
            dataKey="resolution"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            renderer={
              (resolution /*: string | number */) =>
                resolution
                  ? resolution + (typeof resolution === 'number' ? ' Å' : '')
                  : '' /* replace symbol by nothing to be consistent (with go terms column in browse entry for e.g.) */
            }
          >
            Resolution
          </Column>
          <Column
            dataKey="accession"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            defaultKey="structureAccession"
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
                  src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${accession}&file=traces.jpg`}
                  alt={`structure with accession ${accession}`}
                  style={{ maxWidth: '33%' }}
                />
              </Link>
            )}
          >
            Structure
          </Column>
        </Table>
      </section>
    </div>
  );
};
List.propTypes = propTypes;

const subPagesForStructure = new Map();
for (const subPage of config.pages.structure.subPages) {
  subPagesForStructure.set(subPage, subPages.get(subPage));
}

const childRoutesReg = /^[a-z\d]{4}$/i;

const Structure = () => (
  <EndPointPage
    subpagesRoutes={childRoutesReg}
    listOfEndpointEntities={List}
    SummaryAsync={SummaryAsync}
    subPagesForEndpoint={subPagesForStructure}
  />
);

export default Structure;
