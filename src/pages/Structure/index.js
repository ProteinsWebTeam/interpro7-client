import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import MemberDBTabs from 'components/MemberDBTabs';
import { PDBeLink } from 'components/ExtLink';
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

import EntryMenu from 'components/EntryMenu';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
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
  customLocation: { search },
}) => {
  let _payload = payload;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  if (loading || notFound) {
    _payload = {
      results: [],
    };
  }
  const urlHasParameter = url && url.includes('?');
  return (
    <div className={f('row')}>
      <MemberDBTabs />

      <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
        <StructureListFilters /> <hr />
        <Table
          dataTable={_payload.results}
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
            renderer={(accession /*: string */) => (
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
            renderer={(resolution /*: string | number */) =>
              resolution
                ? resolution + (typeof resolution === 'number' ? ' Å' : '')
                : 'ø'
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
                <img
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

const subPagesForStructure = new Set();
for (const subPage of config.pages.structure.subPages) {
  subPagesForStructure.add({
    value: subPage,
    component: subPages.get(subPage),
  });
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
      childRoutes={[{ value: /^[a-z\d]{4}$/i, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const schemaProcessData = data => ({
  '@type': ['Structure', 'DataRecord'],
  '@id': '@mainEntityOfPage',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': data.metadata.source_database,
  },
  mainEntity: '@mainEntity',
});

const schemaProcessData2 = data => ({
  '@type': ['Structure', 'StructuredValue', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  additionalProperty: '@additionalProperty',
});

class Structure extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.shape({
          accession: T.string.isRequired,
        }),
      }),
    }).isRequired,
  };

  render() {
    return (
      <div>
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData}
            />
          )}
        {this.props.data.payload &&
          this.props.data.payload.metadata &&
          this.props.data.payload.metadata.accession && (
            <SchemaOrgData
              data={this.props.data.payload}
              processData={schemaProcessData2}
            />
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

export default loadData()(Structure);
// loadData will create an component that wraps Structure.
// Such component will request content and it will put it in the state and make
// it available for its children. Because there are not parameters when invoking
// the method,the data is requested from the api based on the current URL
