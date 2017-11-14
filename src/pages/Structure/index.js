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
import { HighlightedText } from 'components/SimpleCommonComponents';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

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
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.shape({
    description: T.object.isRequired,
    search: T.object.isRequired,
  }).isRequired,
};

const Overview = ({ data: { payload, loading } }) => {
  if (loading)
    return (
      <div className={f('row')}>
        {' '}
        <div className={f('columns')}>Loading… </div>
      </div>
    );
  return (
    <ul className={f('card')}>
      {Object.entries(payload.structures || {}).map(([name, count]) => (
        <li key={name}>
          <Link
            newTo={{ description: { mainType: 'structure', mainDB: name } }}
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
  data: { payload, loading, url, status },
  isStale,
  location: { search },
}) => {
  let _payload = payload;
  const HTTP_OK = 200;
  const notFound = !loading && status !== HTTP_OK;
  if (loading || notFound) {
    _payload = {
      results: [],
    };
  }
  return (
    <div className={f('row')}>
      <MemberDBTabs />

      <div className={f('columns', 'small-12', 'medium-9', 'large-10')}>
        <StructureListFilters /> <hr />
        <Table
          dataTable={_payload.results}
          isStale={isStale}
          actualSize={_payload.count}
          query={search}
          pathname={''}
          notFound={notFound}
        >
          <Exporter>
            <ul>
              <li>
                <a href={url} download="structures.json">
                  JSON
                </a>
              </li>
              <li>
                <a href={url} download="structures.tsv">
                  TSV
                </a>
              </li>
              <li>
                <a target="_blank" rel="noopener noreferrer" href={url}>
                  Open in API web view
                </a>
              </li>
            </ul>
          </Exporter>
          <PageSizeSelector />
          <SearchBox search={search.search} pathname={''}>
            Search structures
          </SearchBox>
          <Column
            dataKey="accession"
            renderer={(accession /*: string */) => (
              <Link
                newTo={location => ({
                  ...location,
                  description: {
                    mainType: location.description.mainType,
                    mainDB: location.description.mainDB,
                    mainAccession: accession,
                  },
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
                newTo={location => ({
                  ...location,
                  description: {
                    mainType: location.description.mainType,
                    mainDB: location.description.mainDB,
                    mainAccession: accession,
                  },
                })}
              >
                <HighlightedText text={name} textToHighlight={search.search} />
              </Link>
            )}
          >
            Name
          </Column>
          <Column dataKey="experiment_type">Experiment type</Column>
          <Column
            dataKey="accession"
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

const SummaryComponent = ({ data: { payload }, location }) => (
  <SummaryAsync data={payload} location={location} />
);
SummaryComponent.propTypes = {
  data: T.shape({
    payload: T.any,
  }).isRequired,
  location: T.object.isRequired,
};

const subPagesForStructure = new Set();
for (const subPage of config.pages.structure.subPages) {
  subPagesForStructure.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

const Summary = props => {
  const { data: { loading } } = props;
  if (loading)
    return (
      <div className={f('row')}>
        {' '}
        <div className={f('columns')}>Loading… </div>
      </div>
    );
  return (
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={l =>
          l.description.mainDetail || l.description.focusType}
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
  location: T.object.isRequired,
};

// Keep outside! Otherwise will be redefined at each render of the outer Switch
const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l =>
        l.description.mainAccession || l.description.focusType}
      indexRoute={List}
      childRoutes={[{ value: /^[a-z\d]{4}$/i, component: Summary }]}
      catchAll={List}
    />
  </ErrorBoundary>
);

const schemaProcessData = data => ({
  '@type': 'DataRecord',
  '@id': '@mainEntityOfPage',
  additionalType: 'http://semanticscience.org/resource/SIO_011119.rdf',
  identifier: data.metadata.accession,
  isPartOf: {
    '@type': 'Dataset',
    '@id': data.metadata.source_database,
  },
  mainEntity: '@mainEntity',
});

const schemaProcessData2 = data => ({
  '@type': ['StructuredValue', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  additionalType: 'http://semanticscience.org/resource/SIO_010346.rdf',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  additionalProperty: '@additionalProperty',
});

class Structure extends PureComponent {
  static propTypes = {
    isStale: T.bool.isRequired,
    data: T.shape({
      payload: T.shape({
        metadata: T.shape({
          accession: T.string.isRequired,
        }).isRequired,
      }),
    }).isRequired,
  };

  render() {
    return (
      <div
        className={f('with-data', { ['with-stale-data']: this.props.isStale })}
      >
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
            locationSelector={l => l.description.mainDB}
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
