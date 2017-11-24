import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import { OldSwitch } from 'components/generic/Switch';
import { OldLink } from 'components/generic/Link';
import MemberDBTabs from 'components/MemberDBTabs';
import OrganismListFilters from 'components/Organism/OrganismListFilters';
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
import { createSelector } from 'reselect';
import { format } from 'url';

import BrowseTabs from 'components/BrowseTabs';
import Title from 'components/Title';
import subPages from 'subPages';
import config from 'config';

import { foundationPartial } from 'styles/foundation';

import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
const f = foundationPartial(pageStyle, styles);

const propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  isStale: T.bool.isRequired,
  location: T.shape({
    description: T.object.isRequired,
  }).isRequired,
  match: T.string,
};

const defaultPayload = {};

class Overview extends PureComponent {
  static propTypes = propTypes;

  render() {
    const { data: { payload = defaultPayload } } = this.props;
    return (
      <ul className={f('card')}>
        {Object.entries(payload.proteins || {}).map(([name, count]) => (
          <li key={name}>
            <OldLink
              newTo={{ description: { mainType: 'protein', mainDB: name } }}
            >
              {name}
              {Number.isFinite(count) ? ` (${count})` : ''}
            </OldLink>
          </li>
        ))}
      </ul>
    );
  }
}

class List extends PureComponent {
  static propTypes = propTypes;

  render() {
    const {
      data: { payload, loading, url, status },
      isStale,
      location: { search },
    } = this.props;
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
          <OrganismListFilters />
          <hr />
          <Table
            dataTable={_payload.results}
            isStale={isStale}
            actualSize={_payload.count}
            query={search}
            pathname=""
            notFound={notFound}
          >
            <Exporter>
              <ul>
                <li>
                  <a href={url} download="organisms.json">
                    JSON
                  </a>
                </li>
                <li>
                  <a href={url} download="organisms.tsv">
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
            <SearchBox search={search.search} pathname="">
              Search proteins
            </SearchBox>
            <Column
              dataKey="accession"
              renderer={(accession /*: string */) => (
                <OldLink
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: location.description.mainDB,
                      mainAccession: `${accession}`,
                    },
                  })}
                >
                  <HighlightedText
                    text={accession}
                    textToHighlight={search.search}
                  />
                </OldLink>
              )}
            >
              Tax ID
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <OldLink
                  newTo={location => ({
                    ...location,
                    description: {
                      mainType: location.description.mainType,
                      mainDB: location.description.mainDB,
                      mainAccession: `${accession}`,
                    },
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </OldLink>
              )}
            >
              Name
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "organism-summary" */ 'components/Organism/Summary'),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class SummaryComponent extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.any,
    }).isRequired,
    location: T.object.isRequired,
  };

  render() {
    const { data: { payload, loading }, location } = this.props;
    return (
      <SummaryAsync data={payload} location={location} loading={loading} />
    );
  }
}

const subPagesForOrganism = new Set();
for (const subPage of config.pages.organism.subPages) {
  subPagesForOrganism.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

const _Title = ({ data: { loading, payload } }) =>
  loading ? (
    <div>loading</div>
  ) : (
    <Title metadata={payload.metadata} mainType="organism" />
  );
_Title.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }).isRequired,
};
const mapStateToAccessionUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainAccession,
  ({ protocol, hostname, port, root }, mainDB, mainAccession) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/organism/${mainDB}/${mainAccession}`,
    }),
);

const LoadedTitle = loadData(mapStateToAccessionUrl)(_Title);

class Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
    }).isRequired,
    location: T.object.isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading || !payload) {
      return <Loading />;
    }
    return (
      <div>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('medium-12', 'large-12', 'columns')}>
              <LoadedTitle />
              <BrowseTabs />
            </div>
          </div>
          <OldSwitch
            {...this.props}
            locationSelector={l =>
              l.description.mainDetail ||
              l.description.focusType ||
              l.description.mainMemberDB
            }
            indexRoute={SummaryComponent}
            childRoutes={subPagesForOrganism}
          />
        </ErrorBoundary>
      </div>
    );
  }
}

const acc = /(UP\d{9})|(\d+)|(all)/i;
// Keep outside! Otherwise will be redefined at each render of the outer Switch
class InnerSwitch extends PureComponent {
  render() {
    return (
      <ErrorBoundary>
        <OldSwitch
          {...this.props}
          locationSelector={l =>
            l.description.mainAccession || l.description.focusType
          }
          indexRoute={List}
          childRoutes={[{ value: acc, component: Summary }]}
          catchAll={List}
        />
      </ErrorBoundary>
    );
  }
}

const schemaProcessData = data => ({
  '@type': ['Organism', 'BioChemEntity', 'CreativeWork'],
  '@id': '@mainEntity',
  identifier: data.metadata.accession,
  name: data.metadata.name.name || data.metadata.accession,
  alternateName: data.metadata.name.long || null,
  inDataset: data.metadata.source_database,
  biologicalType:
    data.metadata.source_database === 'taxonomy' ? 'taxon' : 'proteome',
  citation: '@citation',
  isBasedOn: '@isBasedOn',
  isBasisFor: '@isBasisFor',
});

class Organism extends PureComponent {
  static propTypes = {
    isStale: T.bool.isRequired,
    data: T.object.isRequired,
  };

  render() {
    const { isStale, data } = this.props;
    return (
      <div className={f('with-data', { ['with-stale-data']: isStale })}>
        {data.payload &&
          data.payload.metadata &&
          data.payload.metadata.accession && (
            <SchemaOrgData
              data={data.payload}
              processData={schemaProcessData}
            />
          )}
        <ErrorBoundary>
          <OldSwitch
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

export default loadData()(Organism);
