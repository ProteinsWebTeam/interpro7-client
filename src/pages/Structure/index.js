import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { PDBeLink } from 'components/ExtLink';
import LazyImage from 'components/LazyImage';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import StructureListFilters from 'components/Structure/StructureListFilters';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';
import { NumberComponent } from 'components/NumberLabel';

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

const f = foundationPartial(ebiGlobalStyles, pageStyle, fonts);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-summary" */ 'components/Structure/Summary'),
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
    search: T.object.isRequired,
  }).isRequired,
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }),
};

const Overview = ({ data: { payload, loading } }) => {
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

class SummaryCounterStructures extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    metadata: T.object.isRequired,
    counters: T.object.isRequired,
  };

  render() {
    const { entryDB, metadata, counters } = this.props;

    const { entries, proteins, taxa } = counters;

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
                main: { key: 'structure' },
                structure: {
                  db: 'pdb',
                  accession: metadata.accession.toString(),
                },
                entry: { isFilter: true, db: entryDB || 'all' },
              },
            }}
          >
            <MemberSymbol type={entryDB || 'all'} className={f('md-small')} />

            <NumberComponent value={entries} abbr scaleMargin={1} />

            <span className={f('label-number')}>
              {toPlural('entry', entries)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${proteins} ${toPlural('protein', proteins)} matching ${
            metadata.name
          }`}
          className={f('count-proteins')}
          style={{ display: 'flex' }}
        >
          <Link
            to={{
              description: {
                main: { key: 'structure' },
                structure: {
                  db: 'pdb',
                  accession: metadata.accession.toString(),
                },
                protein: { isFilter: true, db: 'UniProt' },
              },
            }}
          >
            <div className={f('icon', 'icon-conceptual')} data-icon="&#x50;" />{' '}
            <NumberComponent value={proteins} abbr scaleMargin={1} />
            <span className={f('label-number')}>
              {toPlural('protein', proteins)}
            </span>
          </Link>
        </Tooltip>

        <Tooltip
          title={`${taxa} ${toPlural('taxonomy', taxa)} matching ${
            metadata.name
          }`}
          className={f('count-organisms')}
          style={{ display: 'flex' }}
        >
          <div className={f('container')}>
            <div className={f('icon', 'icon-count-species')} />{' '}
            <NumberComponent value={taxa} abbr scaleMargin={1} />
            <span className={f('label-number')}>
              {toPlural('taxonomy', taxa)}
            </span>
          </div>
        </Tooltip>
      </div>
    );
  }
}

class TaxnameStructures extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { loading, payload },
    } = this.props;

    return (
      // TODO: get values when more than 2 species
      <div
        title={`${loading ||
          payload.results[0].metadata.name}(Tax ID: ${loading ||
          payload.results[0].metadata.accession})`}
      >
        {loading || payload.results[0].metadata.name}
      </div>
    );
  }
}

const getUrlForStructTaxname = accession =>
  createSelector(
    state => state.settings.api,
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

class StructureCard extends PureComponent {
  static propTypes = {
    data: T.object,
    search: T.string,
    entryDB: T.string,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextAccession = nextProps.data.metadata.accession;

    if (nextAccession === prevState.accession) return null;

    return {
      TaxnameStructuresWithData: loadData(
        getUrlForStructTaxname(nextAccession),
      )(TaxnameStructures),
      accession: nextAccession,
    };
  }

  constructor(props) {
    super(props);

    const accession = props.data.metadata.accession;
    this.state = {
      TaxnameStructuresWithData: loadData(getUrlForStructTaxname(accession))(
        TaxnameStructures,
      ),
      accession,
    };
  }

  render() {
    const { data, search, entryDB } = this.props;
    const { TaxnameStructuresWithData } = this.state;
    return (
      <React.Fragment>
        <div className={f('card-header')}>
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
            <Tooltip
              title={`3D visualisation for ${
                data.metadata.accession
              } structure`}
            >
              <LazyImage
                src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${
                  data.metadata.accession
                }/traces.jpg`}
                alt={`structure with accession ${data.metadata.accession}`}
              />
            </Tooltip>
            <h6>
              <HighlightedText
                text={data.metadata.name}
                textToHighlight={search}
              />
            </h6>
          </Link>

          <div className={f('card-subheader')}>
            {// INFO RESOLUTION BL - browse structures - Xray
            data.metadata.experiment_type === 'x-ray' && (
              <Tooltip
                title={`X-ray, resolution ${data.metadata.resolution} Å`}
              >
                {data.metadata.experiment_type}
                {': '}
                {data.metadata.resolution}Å
              </Tooltip>
            )}
            {// INFO TYPE BL - browse structures -NMR
            data.metadata.experiment_type === 'nmr' && (
              <Tooltip title="Nuclear Magnetic Resonance">
                {data.metadata.experiment_type}
              </Tooltip>
            )}
          </div>
        </div>

        {data.extra_fields &&
          data.metadata &&
          data.extra_fields.counters && (
            <SummaryCounterStructures
              metadata={data.metadata}
              entryDB={entryDB}
              counters={data.extra_fields.counters}
            />
          )}
        <div className={f('card-footer')}>
          <TaxnameStructuresWithData />
          <div>
            <HighlightedText
              text={data.metadata.accession}
              textToHighlight={search}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const List = ({
  data: { payload, loading, ok, url, status },
  isStale,
  customLocation: {
    description: {
      entry: { db: entryDB },
      structure: { db },
    },
    search,
  },
  dataBase,
}) => {
  let _payload = payload;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  const databases = dataBase && dataBase.payload && dataBase.payload.databases;
  if (loading || notFound) {
    _payload = {
      results: [],
    };
  }
  const urlHasParameter = url && url.includes('?');
  const includeGrid = url;
  return (
    <div className={f('row')}>
      <MemberDBSelector
        contentType="structure"
        className="left-side-db-selector"
      />

      <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
        <StructureListFilters /> <hr />
        {databases &&
          db &&
          databases[db.toUpperCase()] && (
            <SchemaOrgData
              data={{
                data: { db: databases[db.toUpperCase()] },
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
          isStale={isStale}
          actualSize={_payload.count}
          query={search}
          notFound={notFound}
          withGrid={!!includeGrid}
        >
          <Exporter>
            <ul>
              <li>
                <Link href={url} download="structures.json">
                  JSON
                </Link>
              </li>
              <li>
                <Link
                  href={`${url}${urlHasParameter ? '&' : '?'}format=tsv`}
                  download="structures.tsv"
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
              <StructureCard
                data={data}
                search={search.search}
                entryDB={entryDB}
              />
            )}
          </Card>
          <SearchBox>Search structures</SearchBox>
          <Column
            dataKey="accession"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            renderer={(accession /*: string */, row) => (
              <Link
                to={customLocation => ({
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
                <HighlightedText text={name} textToHighlight={search.search} />
              </Link>
            )}
          >
            Name
          </Column>
          <Column
            dataKey="experiment_type"
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
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
              <PDBeLink id={accession}>
                <LazyImage
                  src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${accession}/traces.jpg`}
                  alt={`structure with accession ${accession.toUpperCase()}`}
                  style={{ maxWidth: '33%' }}
                />
              </PDBeLink>
            )}
          >
            Structure
          </Column>
        </Table>
      </div>
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
