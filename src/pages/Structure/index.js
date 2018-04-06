import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
import { PDBeLink } from 'components/ExtLink';
import LazyImage from 'components/LazyImage';
import StructureListFilters from 'components/Structure/StructureListFilters';
import Table, {
  Column,
  SearchBox,
  PageSizeSelector,
  Exporter,
} from 'components/Table';

import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
  schemaProcessDataRecord,
  schemaProcessMainEntity,
} from 'schema_org/processors';

import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
const f = foundationPartial(pageStyle, styles);

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

const List = ({
  data: { payload, loading, ok, url, status },
  isStale,
  customLocation: { description: { structure: { db } }, search },
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
  return (
    <div className={f('row')}>
      <MemberDBSelector contentType="structure" />

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
          <SearchBox search={search.search}>Search structures</SearchBox>
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

const SummaryComponent = ({ data: { payload }, customLocation }) => (
  <SummaryAsync data={payload} customLocation={customLocation} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.any,
  }).isRequired,
  customLocation: T.object.isRequired,
};

const subPagesForStructure = new Map();
for (const subPage of config.pages.structure.subPages) {
  subPagesForStructure.set(subPage, subPages.get(subPage));
}

const Summary = props => {
  const { data: { loading, payload } } = props;
  if (loading || !payload || !payload.metadata) return <Loading />;
  return (
    <ErrorBoundary>
      <div className={f('row')}>
        <div className={f('medium-12', 'large-12', 'columns')}>
          <Title metadata={payload.metadata} mainType="structure" />
          <EntryMenu metadata={payload.metadata} />
        </div>
      </div>
      <Switch
        {...props}
        locationSelector={l => {
          const { key } = l.description.main;
          return (
            l.description[key].detail ||
            (Object.entries(l.description).find(
              ([_key, value]) => value.isFilter,
            ) || [])[0]
          );
        }}
        indexRoute={SummaryComponent}
        childRoutes={subPagesForStructure}
      />
    </ErrorBoundary>
  );
};
Summary.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
  }).isRequired,
  customLocation: T.object.isRequired,
};

const childRoutes = new Map([[/^[a-z\d]{4}$/i, Summary]]);
// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => {
        const { key } = l.description.main;
        return (
          l.description[key].accession ||
          (Object.entries(l.description).find(
            ([_key, value]) => value.isFilter,
          ) || [])[0]
        );
      }}
      indexRoute={List}
      childRoutes={childRoutes}
      catchAll={List}
    />
  </ErrorBoundary>
);

class Structure extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.shape({
          accession: T.string.isRequired,
        }),
      }),
    }).isRequired,
    dataBase: T.shape({
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const { dataBase } = this.props;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    return (
      <div>
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <Fragment>
              <SchemaOrgData
                data={{
                  data: this.props.data.payload,
                  endpoint: 'structure',
                  version: databases && databases.PDB.version,
                }}
                processData={schemaProcessDataRecord}
              />
              <SchemaOrgData
                data={{
                  data: this.props.data.payload.metadata,
                  type: 'Structure',
                }}
                processData={schemaProcessMainEntity}
              />
            </Fragment>
          )}
        <ErrorBoundary>
          <Switch
            {...this.props}
            locationSelector={l => l.description[l.description.main.key].db}
            indexRoute={Overview}
            catchAll={InnerSwitch}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  loadData()(Structure),
);
